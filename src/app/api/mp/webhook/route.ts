import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

function verifyMPSignature(req: Request, body: any): boolean {
  const signature = req.headers.get("x-signature")
  const webhookSecret = process.env.MP_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.warn("MP_WEBHOOK_SECRET not configured, skipping signature verification")
    return true
  }
  if (!signature) {
    console.warn("Missing x-signature header")
    return false
  }

  const parts = signature.split(",")
  let ts = ""
  let hash = ""
  for (const part of parts) {
    const [key, ...rest] = part.split("=")
    const value = rest.join("=")
    if (key === "ts") ts = value
    if (key === "v1") hash = value
  }

  if (!ts || !hash) return false

  const dataId = body.data?.id || body.id
  if (!dataId) return false

  const template = `id:${dataId}`
  const computed = crypto
    .createHmac("sha256", webhookSecret)
    .update(template)
    .digest("hex")

  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!verifyMPSignature(req, body)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const paymentId = body.data?.id || body.id
    const topic = body.type || "payment"

    if (topic !== "payment" || !paymentId) {
      return NextResponse.json({ received: true })
    }

    const mpRes = await fetch("https://api.mercadopago.com/v1/payments/" + paymentId, {
      headers: {
        Authorization: "Bearer " + process.env.MP_ACCESS_TOKEN,
      },
    })

    if (!mpRes.ok) {
      return NextResponse.json({ error: "Failed to fetch payment" }, { status: 400 })
    }

    const payment = await mpRes.json()
    const orderId = payment.external_reference
    const paymentStatus = payment.status

    if (!orderId) {
      return NextResponse.json({ received: true })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.status === "paid" || order.status === "delivered") {
      return NextResponse.json({ received: true })
    }

    if (paymentStatus === "approved") {
      for (const item of order.items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } })
        if (!product || product.stock < item.quantity) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "cancelled", paymentStatus: "insufficient_stock" },
          })
          return NextResponse.json({ received: true })
        }
      }

      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentId: String(paymentId),
          paymentStatus,
          status: "paid",
        },
      })
    } else if (paymentStatus === "refunded" || paymentStatus === "charged_back") {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      }

      await prisma.order.update({
        where: { id: orderId },
        data: { paymentId: String(paymentId), paymentStatus, status: "cancelled" },
      })
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentId: String(paymentId),
          paymentStatus,
          status: paymentStatus === "rejected" || paymentStatus === "cancelled" ? "cancelled" : "pending",
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

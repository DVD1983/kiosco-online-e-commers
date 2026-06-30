import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { preference } from "@/lib/mp"
import { checkoutSchema } from "@/lib/schemas"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        error: "Datos inválidos",
        details: parsed.error.flatten().fieldErrors,
      }, { status: 400 })
    }

    const { customerName, customerEmail, customerPhone, shippingAddress, items } = parsed.data

    const productIds = items.map((i) => i.id)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    for (const item of items) {
      const product = productMap.get(item.id)
      if (!product) {
        return NextResponse.json({ error: "Producto no encontrado: " + item.id }, { status: 400 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: "Stock insuficiente para: " + product.name }, { status: 400 })
      }
    }

    const total = items.reduce((sum, item) => {
      const product = productMap.get(item.id)!
      return sum + Number(product.price) * item.quantity
    }, 0)

    const order = await prisma.order.create({
      data: {
        total,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        shippingAddress: shippingAddress || null,
        status: "pending",
        items: {
          create: items.map((item) => {
            const product = productMap.get(item.id)!
            return {
              productId: item.id,
              quantity: item.quantity,
              price: product.price,
            }
          }),
        },
      },
    })

    const prefItems = items.map((item) => {
      const product = productMap.get(item.id)!
      return {
        id: product.id,
        title: product.name,
        quantity: item.quantity,
        unit_price: Number(product.price),
        currency_id: "ARS",
      }
    })

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    try {
      const mpPreference = await preference.create({
        body: {
          items: prefItems,
          payer: {
            name: customerName,
            email: customerEmail,
          },
          back_urls: {
            success: baseUrl + "/pedido/" + order.id,
            failure: baseUrl + "/pedido/" + order.id,
            pending: baseUrl + "/pedido/" + order.id,
          },
          auto_return: "approved",
          notification_url: baseUrl + "/api/mp/webhook",
          external_reference: order.id,
        },
      })

      return NextResponse.json({
        orderId: order.id,
        init_point: mpPreference.init_point,
      })
    } catch (mpError) {
      await prisma.order.delete({ where: { id: order.id } })
      console.error("MP preference error:", mpError)
      return NextResponse.json({ error: "Error al crear preferencia de pago" }, { status: 500 })
    }
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

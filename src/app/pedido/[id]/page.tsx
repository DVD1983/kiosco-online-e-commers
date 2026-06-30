import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, Badge, Button } from "@/components/ui"
import Link from "next/link"
import { CheckCircle, Clock } from "lucide-react"

export const dynamic = 'force-dynamic'
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PedidoPage({ params }: PageProps) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  })

  if (!order) notFound()

  const isPaid = order.status !== "pending" && order.status !== "cancelled"

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
      {isPaid ? (
        <CheckCircle className="mx-auto size-16 text-accent" />
      ) : (
        <Clock className="mx-auto size-16 text-secondary" />
      )}

      <h1 className="mt-4 text-3xl font-bold">
        {isPaid ? "Pedido confirmado" : "Esperando pago"}
      </h1>
      <p className="mt-2 text-muted">
        {isPaid
          ? "Gracias por tu compra. Te vamos a contactar para coordinar la entrega."
          : "Estamos procesando tu pago. Te avisamos cuando se confirme."}
      </p>

      <Card className="mt-8 p-6 text-left">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Pedido #{order.id.slice(0, 8)}</h2>
          <Badge variant={order.status === "paid" ? "success" : order.status === "cancelled" ? "danger" : "warning"}>
            {order.status === "paid" ? "Pagado" : order.status === "pending" ? "Pendiente" : order.status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <p><span className="text-muted">Cliente:</span> {order.customerName}</p>
          <p><span className="text-muted">Email:</span> {order.customerEmail}</p>
          {order.shippingAddress && <p><span className="text-muted">Dirección:</span> {order.shippingAddress}</p>}
        </div>

        <div className="mt-4 space-y-2 border-t pt-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.product?.name} x{item.quantity}</span>
              <span>${(Number(item.price) * item.quantity).toLocaleString("es-AR")}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>${Number(order.total).toLocaleString("es-AR")}</span>
          </div>
        </div>
      </Card>

      <Link href="/productos">
        <Button className="mt-6">Seguir comprando</Button>
      </Link>
    </div>
  )
}

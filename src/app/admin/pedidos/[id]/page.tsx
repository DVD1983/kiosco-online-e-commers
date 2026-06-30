import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, Badge, Button } from "@/components/ui"
import Link from "next/link"
import { OrderStatusUpdater } from "./order-status-updater"

export const dynamic = 'force-dynamic'
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PedidoDetailPage({ params }: PageProps) {
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

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      paid: "Pagado",
      pending: "Pendiente",
      cancelled: "Cancelado",
      preparing: "Preparando",
      sent: "Enviado",
      delivered: "Entregado",
    }
    return map[status] || status
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/pedidos" className="text-sm text-primary hover:underline mb-2 block">
          &larr; Volver a pedidos
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pedido #{order.id.slice(0, 8)}</h1>
          <Badge variant={order.status === "paid" ? "success" : order.status === "cancelled" ? "danger" : "warning"}>
            {statusLabel(order.status)}
          </Badge>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <h2 className="font-semibold mb-2">Datos del cliente</h2>
          <div className="text-sm space-y-1 text-muted">
            <p>Nombre: {order.customerName}</p>
            <p>Email: {order.customerEmail}</p>
            {order.customerPhone && <p>Teléfono: {order.customerPhone}</p>}
            {order.shippingAddress && <p>Dirección: {order.shippingAddress}</p>}
          </div>
        </div>

        <div className="border-t pt-4">
          <h2 className="font-semibold mb-2">Productos</h2>
          <div className="space-y-2 text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product?.name} x{item.quantity}</span>
                <span>${(Number(item.price) * item.quantity).toLocaleString("es-AR")}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>${Number(order.total).toLocaleString("es-AR")}</span>
            </div>
          </div>
        </div>

        {order.paymentId && (
          <div className="border-t pt-4 text-sm text-muted">
            <p>Pago ID: {order.paymentId}</p>
            <p>Estado del pago: {order.paymentStatus}</p>
          </div>
        )}

        <div className="border-t pt-4">
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </Card>
    </div>
  )
}

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button, Card, Badge } from "@/components/ui"

export const dynamic = 'force-dynamic'
export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const statusBadge = (status: string) => {
    const map: Record<string, "success" | "warning" | "danger" | "info"> = {
      paid: "success",
      pending: "warning",
      cancelled: "danger",
      preparing: "info",
      sent: "info",
      delivered: "success",
    }
    return map[status] || "default"
  }

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
    <div>
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-muted">No hay pedidos todavía</p>
        ) : (
          orders.map((order) => (
            <Link key={order.id} href={"/admin/pedidos/" + order.id}>
              <Card className="flex items-center justify-between p-4 transition-shadow hover:shadow-md">
                <div>
                  <p className="font-medium">#{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted">
                    {order.customerName} | ${Number(order.total).toLocaleString("es-AR")} | {order.items.length} items
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusBadge(order.status)}>
                    {statusLabel(order.status)}
                  </Badge>
                  <p className="text-xs text-muted">
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

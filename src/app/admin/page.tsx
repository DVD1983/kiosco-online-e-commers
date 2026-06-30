import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui"
import { Package, ShoppingBag, Tags, DollarSign } from "lucide-react"

export const dynamic = 'force-dynamic'
export default async function AdminDashboard() {
  const [productCount, orderCount, categoryCount, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.category.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "paid" },
    }),
  ])

  const stats = [
    { label: "Productos", value: productCount, icon: Package, color: "text-blue-600 bg-blue-100" },
    { label: "Pedidos", value: orderCount, icon: ShoppingBag, color: "text-green-600 bg-green-100" },
    { label: "Categorías", value: categoryCount, icon: Tags, color: "text-amber-600 bg-amber-100" },
    { label: "Ingresos", value: "$" + (Number(totalRevenue._sum.total || 0)).toLocaleString("es-AR"), icon: DollarSign, color: "text-purple-600 bg-purple-100" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center gap-4">
                <div className={"rounded-lg p-3 " + stat.color}>
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="text-sm text-muted">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/products/product-card"
import { ProductsFilter } from "./products-filter"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{ categoria?: string; busqueda?: string }>
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const { categoria, busqueda } = await searchParams

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  const where: Record<string, unknown> = {}

  if (categoria) {
    const cat = categories.find(c => c.slug === categoria)
    if (cat) where.categoryId = cat.id
  }

  if (busqueda) {
    where.OR = [
      { name: { contains: busqueda } },
      { description: { contains: busqueda } },
    ]
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  const mapped = products.map(p => ({ ...p, price: Number(p.price) }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>

      <ProductsFilter categories={categories} currentCategoria={categoria || ""} currentBusqueda={busqueda || ""} />

      {mapped.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <p className="text-lg">No encontramos productos</p>
          <p className="text-sm">Probá con otra búsqueda o categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {mapped.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

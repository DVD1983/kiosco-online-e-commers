import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Button, Card, Badge } from "@/components/ui"
import { ProductCard } from "@/components/products/product-card"
import { DiscountCarousel } from "@/components/products/discount-carousel"
import { getFirstImage } from "@/lib/images"
import { Store, ArrowRight, Package } from "lucide-react"

export const dynamic = 'force-dynamic'
async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  })
  return products.map(p => ({
    ...p,
    price: Number(p.price),
  }))
}

async function getDiscountProducts() {
  const products = await prisma.product.findMany({
    where: { discount: { gt: 0 } },
    include: { category: true },
    orderBy: { discount: "desc" },
  })
  return products.map(p => ({
    ...p,
    price: Number(p.price),
  }))
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  })
  return categories
}

export default async function HomePage() {
  const [products, discountProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getDiscountProducts(),
    getCategories(),
  ])

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-secondary/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Badge variant="info" className="mb-4">Abierto 24 horas</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Ped&iacute; lo que quieras,{" "}
                <span className="text-primary">no te muevas</span>
              </h1>
              <p className="mt-4 text-lg text-muted sm:text-xl">
                Hacemos env&iacute;os gratis en Palermo. Ped&iacute; desde casa y recib&iacute; en minutos. 24 horas, todos los d&iacute;as.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/productos">
                  <Button size="lg">
                    Ver productos
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="#categorias">
                  <Button variant="outline" size="lg">
                    Categor&iacute;as
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src="https://thumbs.dreamstime.com/b/motorcycle-delivery-parcel-fast-service-motorcycle-delivery-service-parcel-365698248.jpg"
                  alt="Delivery Kiosco Online 24H"
                  fill
                  sizes="(max-width: 1024px) 0px, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tl from-primary/30 via-transparent to-secondary/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {discountProducts.length > 0 && (
        <DiscountCarousel products={discountProducts} />
      )}

      {categories.length > 0 && (
        <section id="categorias" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Categor&iacute;as</h2>
            <Link href="/productos" className="text-sm text-primary hover:underline">
              Ver todo
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={"/productos?categoria=" + cat.slug}>
                <Card className="flex flex-col items-center gap-2 p-6 text-center transition-shadow hover:shadow-md">
                  {cat.image ? (
                    <div className="relative size-16 overflow-hidden rounded-lg">
                      <Image src={cat.image} alt={cat.name} fill sizes="64px" className="object-cover" />
                    </div>
                  ) : (
                    <Package className="size-8 text-primary" />
                  )}
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-xs text-muted">{cat._count.products} productos</span>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Productos destacados</h2>
            <Link href="/productos" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">
            &iquest;Ten&eacute;s un kiosco y quer&eacute;s vender online?
          </h2>
          <p className="mt-4 text-muted">
            Contactanos y te ayudamos a montar tu tienda digital.
          </p>
        </div>
      </section>
    </div>
  )
}

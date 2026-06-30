import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "./product-detail-client"
import { getFirstImage } from "@/lib/images"

export const dynamic = 'force-dynamic'
interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })

  if (!product) return {}

  return {
    title: product.name + " | Kiosco Online 24H",
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: getFirstImage(product.images) ? [{ url: getFirstImage(product.images) }] : [],
    },
  }
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!product) notFound()

  const mapped = { ...product, price: Number(product.price) }

  return <ProductDetailClient product={mapped} />
}

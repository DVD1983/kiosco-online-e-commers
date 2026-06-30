"use client"

import Link from "next/link"
import { Button, Card, Badge } from "@/components/ui"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { getFirstImage } from "@/lib/images"
import type { ProductWithCategory } from "@/types"

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const { addItem } = useCart()
  const firstImage = getFirstImage(product.images)
  const discount = product.discount ?? 0
  const hasDiscount = discount > 0
  const displayPrice = hasDiscount
    ? product.price * (1 - discount / 100)
    : product.price

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("Producto sin stock")
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      price: displayPrice,
      image: firstImage,
      quantity: 1,
      slug: product.slug,
      stock: product.stock,
    })
    toast.success(product.name + " agregado al carrito")
  }

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <Link href={"/productos/" + product.slug} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          {hasDiscount && (
            <Badge variant="danger" className="absolute left-2 top-2 z-10 text-xs font-bold">
              -{discount}%
            </Badge>
          )}
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              Sin imagen
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        {product.category && (
          <Badge variant="default" className="mb-1">{product.category.name}</Badge>
        )}
        <Link href={"/productos/" + product.slug}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-primary">
              ${Number(displayPrice).toLocaleString("es-AR")}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted line-through">
                ${Number(product.price).toLocaleString("es-AR")}
              </span>
            )}
          </div>
          {product.stock <= 0 && (
            <Badge variant="danger">Sin stock</Badge>
          )}
        </div>
        <Button
          onClick={handleAddToCart}
          size="sm"
          className="mt-2 w-full"
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="mr-1 size-4" />
          Agregar
        </Button>
      </div>
    </Card>
  )
}

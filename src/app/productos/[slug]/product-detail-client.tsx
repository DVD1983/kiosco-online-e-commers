"use client"

import { useCart } from "@/lib/cart-context"
import { Button, Badge } from "@/components/ui"
import Image from "next/image"
import { ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import Link from "next/link"
import { getImages, getFirstImage } from "@/lib/images"
import type { ProductWithCategory } from "@/types"

export function ProductDetailClient({ product }: { product: ProductWithCategory }) {
  const { addItem, items } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const allImages = getImages(product.images)
  const currentImage = allImages[selectedImage] || ""
  const discount = product.discount ?? 0
  const hasDiscount = discount > 0
  const displayPrice = hasDiscount
    ? product.price * (1 - discount / 100)
    : product.price

  const cartItem = items.find(i => i.id === product.id)
  const inCart = cartItem?.quantity || 0

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: displayPrice,
      image: currentImage,
      quantity,
      slug: product.slug,
      stock: product.stock,
    })
    toast.success(product.name + " agregado al carrito")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            {hasDiscount && (
              <Badge variant="danger" className="absolute left-3 top-3 z-10 text-sm font-bold">
                -{discount}%
              </Badge>
            )}
            {currentImage ? (
              <>
                <Image src={currentImage} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-sm hover:bg-white"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev + 1) % allImages.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-sm hover:bg-white"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-muted text-lg">
                Sin imagen disponible
              </div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={"relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors " + (i === selectedImage ? "border-primary" : "border-border hover:border-gray-300")}
                >
                  <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          {product.category && (
            <Badge variant="info" className="mb-2">{product.category.name}</Badge>
          )}
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-muted leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              ${Number(displayPrice).toLocaleString("es-AR")}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted line-through">
                  ${Number(product.price).toLocaleString("es-AR")}
                </span>
                <Badge variant="danger" className="text-sm font-bold">
                  -{discount}%
                </Badge>
              </>
            )}
          </div>

          <div className="mt-2">
            {product.stock > 0 ? (
              <Badge variant="success">En stock ({product.stock} uni.)</Badge>
            ) : (
              <Badge variant="danger">Sin stock</Badge>
            )}
          </div>

          {inCart > 0 && (
            <p className="mt-2 text-sm text-muted">
              Ya tenés {inCart} unidad{inCart > 1 ? "es" : ""} en tu <Link href="/carrito" className="text-primary hover:underline">carrito</Link>
            </p>
          )}

          {product.stock > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <Button onClick={handleAdd} size="lg" className="flex-1">
                <ShoppingCart className="mr-2 size-4" />
                Agregar al carrito
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

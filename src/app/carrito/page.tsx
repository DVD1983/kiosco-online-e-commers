"use client"

import Link from "next/link"
import { Button, Card } from "@/components/ui"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import { Trash2, Minus, Plus, ShoppingCart as CartIcon, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <CartIcon className="size-16 text-muted" />
          <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
          <p className="text-muted">Agregá productos desde nuestro catálogo</p>
          <Link href="/productos">
            <Button>
              <ArrowLeft className="mr-2 size-4" />
              Ver productos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="flex gap-4 p-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">Sin img</div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={"/productos/" + item.slug} className="font-medium hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted">${item.price.toLocaleString("es-AR")} c/u</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-border">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">${(item.price * item.quantity).toLocaleString("es-AR")}</span>
                    <button onClick={() => removeItem(item.id)} className="text-muted hover:text-danger transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Resumen</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal ({items.length} productos)</span>
                <span>${totalPrice.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Envío</span>
                <span className="text-accent font-medium">Gratis</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toLocaleString("es-AR")}</span>
              </div>
            </div>
            <Button
              variant="danger"
              className="mt-4 w-full"
              onClick={() => {
                if (confirm("¿Vaciar el carrito? Se perderán todos los productos.")) {
                  clearCart()
                  toast.success("Carrito vaciado")
                }
              }}
            >
              <Trash2 className="mr-2 size-4" />
              Vaciar carrito
            </Button>
            <Link href="/checkout">
              <Button className="mt-6 w-full" size="lg">
                Ir al checkout
              </Button>
            </Link>
            <Link href="/productos" className="mt-3 block text-center text-sm text-primary hover:underline">
              Seguir comprando
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}

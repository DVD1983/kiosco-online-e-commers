"use client"

import { useState, useEffect, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { Button, Card, Input, Label } from "@/components/ui"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
  })
  const mounted = useMounted()

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/carrito")
    }
  }, [mounted, items.length, router])

  if (!mounted || items.length === 0) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.customerName || !form.customerEmail) {
      toast.error("Completá nombre y email")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Error al procesar el pedido")
        return
      }

      clearCart()

      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        router.push("/pedido/" + data.orderId)
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Datos de contacto</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Nombre completo *</Label>
                <Input id="customerName" name="customerName" value={form.customerName} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email *</Label>
                <Input id="customerEmail" name="customerEmail" type="email" value={form.customerEmail} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="customerPhone">Teléfono</Label>
                <Input id="customerPhone" name="customerPhone" value={form.customerPhone} onChange={handleChange} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Dirección de envío</h2>
            <p className="text-sm text-muted mb-3">Envíos gratis en Palermo, CABA</p>
            <div>
              <Label htmlFor="shippingAddress">Dirección</Label>
              <Input id="shippingAddress" name="shippingAddress" value={form.shippingAddress} onChange={handleChange} placeholder="Calle y número, piso, etc." />
            </div>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Procesando..." : "Ir a pagar"}
          </Button>
        </form>

        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted">{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toLocaleString("es-AR")}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toLocaleString("es-AR")}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
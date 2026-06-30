"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Select, Label } from "@/components/ui"
import { toast } from "sonner"

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
  { value: "preparing", label: "Preparando" },
  { value: "sent", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
]

export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (status === currentStatus) return
    setLoading(true)

    try {
      const res = await fetch("/api/admin/pedidos/" + orderId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        toast.error("Error al actualizar")
        return
      }

      toast.success("Estado actualizado")
      router.refresh()
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Label htmlFor="status">Estado del pedido</Label>
      <div className="flex gap-2 mt-1">
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 flex-1 rounded-lg border border-border bg-white px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <Button onClick={handleUpdate} disabled={loading || status === currentStatus}>
          {loading ? "..." : "Actualizar"}
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button, Badge, Card } from "@/components/ui"
import Image from "next/image"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { getFirstImage } from "@/lib/images"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  images: string
  featured: boolean
  category: { name: string } | null
}

export default function AdminProductosPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/productos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return

    const res = await fetch("/api/admin/productos/" + id, { method: "DELETE" })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || "Error al eliminar")
      return
    }

    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast.success("Producto eliminado")
    router.refresh()
  }

  if (loading) return <p className="text-muted">Cargando...</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link href="/admin/productos/nuevo">
          <Button>
            <Plus className="mr-1 size-4" />
            Nuevo
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-muted">No hay productos todavía</p>
        ) : (
          products.map((p) => (
            <Card key={p.id} className="flex items-center gap-4 p-4">
              <div className="size-12 shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                {p.images ? (
                  <Image src={getFirstImage(p.images)} alt={p.name} width={48} height={48} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-sm text-muted">
                  ${Number(p.price).toLocaleString("es-AR")} | Stock: {p.stock}
                  {p.category && " | " + p.category.name}
                </p>
              </div>
              <Badge variant={p.featured ? "success" : "default"}>{p.featured ? "Destacado" : "Normal"}</Badge>
              <Link href={"/admin/productos/" + p.id}>
                <Button variant="ghost" size="sm">
                  <Pencil className="size-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id, p.name)}>
                <Trash2 className="size-4 text-red-500" />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

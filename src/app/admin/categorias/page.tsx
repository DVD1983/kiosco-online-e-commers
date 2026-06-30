"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button, Card } from "@/components/ui"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Category = {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

export default function AdminCategoriasPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/categorias")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string, name: string, count: number) => {
    if (count > 0) {
      toast.error(`No se puede eliminar "${name}" porque tiene ${count} producto(s) asociado(s)`)
      return
    }
    if (!confirm(`¿Eliminar la categoría "${name}"?`)) return

    const res = await fetch("/api/admin/categorias/" + id, { method: "DELETE" })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || "Error al eliminar")
      return
    }

    setCategories((prev) => prev.filter((c) => c.id !== id))
    toast.success("Categoría eliminada")
    router.refresh()
  }

  if (loading) return <p className="text-muted">Cargando...</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Link href="/admin/categorias/nuevo">
          <Button>
            <Plus className="mr-1 size-4" />
            Nueva
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {categories.length === 0 ? (
          <p className="text-muted">No hay categorías todavía</p>
        ) : (
          categories.map((cat) => (
            <Card key={cat.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-sm text-muted">{cat._count.products} productos</p>
              </div>
              <div className="flex gap-1">
                <Link href={"/admin/categorias/" + cat.id}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="size-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id, cat.name, cat._count.products)}>
                  <Trash2 className="size-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

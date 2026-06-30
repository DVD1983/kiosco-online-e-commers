"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Card, Input, Label } from "@/components/ui"
import { toast } from "sonner"

interface CategoryFormProps {
  initialData?: { id: string; name: string; slug: string; image: string | null }
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    image: initialData?.image || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData
        ? "/api/admin/categorias/" + initialData.id
        : "/api/admin/categorias"
      const method = initialData ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Error al guardar")
        return
      }

      toast.success(initialData ? "Categoría actualizada" : "Categoría creada")
      router.push("/admin/categorias")
      router.refresh()
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    setForm((prev) => ({
      ...prev,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <Card className="p-6 space-y-4">
        <div>
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={(e) => {
              handleChange(e)
              if (!initialData) generateSlug(e.target.value)
            }}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" value={form.slug} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="image">URL de imagen (opcional)</Label>
          <Input id="image" name="image" value={form.image} onChange={handleChange} />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

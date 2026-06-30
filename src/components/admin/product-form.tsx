"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Card, Input, Label, Textarea, Select } from "@/components/ui"
import { toast } from "sonner"
import Image from "next/image"
import { encodeImages, getImages } from "@/lib/images"
import { UploadButton } from "@/lib/uploadthing-button"

interface ProductFormProps {
  categories: { id: string; name: string }[]
  initialData?: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    stock: number
    featured: boolean
    categoryId: string | null
    images: string
  }
}

function parseImagesForForm(images: string): string {
  if (!images) return ""
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed.join("\n") : images
  } catch {
    return images
  }
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price.toString() || "",
    stock: initialData?.stock.toString() || "0",
    featured: initialData?.featured || false,
    categoryId: initialData?.categoryId || "",
    images: initialData ? parseImagesForForm(initialData.images) : "",
  })
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(
    initialData ? getImages(initialData.images) : []
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData
        ? "/api/admin/productos/" + initialData.id
        : "/api/admin/productos"
      const method = initialData ? "PUT" : "POST"

      const finalImages = uploadedUrls.length > 0
        ? encodeImages(uploadedUrls)
        : encodeImages(form.images.split("\n").filter(Boolean))

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          images: finalImages,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Error al guardar")
        return
      }

      toast.success(initialData ? "Producto actualizado" : "Producto creado")
      router.push("/admin/productos")
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card className="p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="price">Precio *</Label>
            <Input id="price" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="categoryId">Categoría</Label>
            <Select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange}>
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="featured">Producto destacado</Label>
        </div>
        <div>
          <Label>Imágenes</Label>
          <div className="mt-2 space-y-3">
            {uploadedUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploadedUrls.map((url, i) => (
                  <div key={i} className="group relative size-20 overflow-hidden rounded-lg border border-border">
                    <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const next = uploadedUrls.filter((_, j) => j !== i)
                        setUploadedUrls(next)
                        setForm({ ...form, images: encodeImages(next) })
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <span className="text-xs text-white">Eliminar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <UploadButton
              endpoint="productImage"
              onClientUploadComplete={(res) => {
                if (!res) return
                const urls = res.map((r) => r.ufsUrl)
                const all = [...uploadedUrls, ...urls]
                setUploadedUrls(all)
                setForm({ ...form, images: encodeImages(all) })
                toast.success("Imagen subida")
              }}
              onUploadError={(err) => {
                toast.error(err.message || "Error al subir imagen")
              }}
              appearance={{
                button: "h-10 px-4 text-sm rounded-lg border border-border bg-white hover:bg-gray-50 text-foreground",
                allowedContent: "text-xs text-muted mt-1",
              }}
            />
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-muted hover:text-foreground">O ingresar URLs manualmente</summary>
            <Textarea
              id="images"
              name="images"
              value={form.images}
              onChange={handleChange}
              rows={2}
              className="mt-2"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </details>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : initialData ? "Actualizar" : "Crear producto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

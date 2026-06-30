"use client"

import { useRouter } from "next/navigation"
import { Input, Button } from "@/components/ui"
import { Search } from "lucide-react"

export function ProductsFilter({
  categories,
  currentCategoria,
  currentBusqueda,
}: {
  categories: { id: string; name: string; slug: string }[]
  currentCategoria: string
  currentBusqueda: string
}) {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const busqueda = form.get("busqueda") as string
    const categoria = form.get("categoria") as string
    const params = new URLSearchParams()
    if (busqueda) params.set("busqueda", busqueda)
    if (categoria) params.set("categoria", categoria)
    const qs = params.toString()
    router.push("/productos" + (qs ? "?" + qs : ""))
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <Input
          name="busqueda"
          defaultValue={currentBusqueda}
          placeholder="Buscar productos..."
          className="pl-9"
        />
      </div>
      <select
        name="categoria"
        defaultValue={currentCategoria}
        className="h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50"
      >
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
      <Button type="submit" variant="secondary">Filtrar</Button>
    </form>
  )
}

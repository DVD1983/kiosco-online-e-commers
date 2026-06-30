import { CategoryForm } from "@/components/admin/category-form"

export const dynamic = 'force-dynamic'
export default function NuevaCategoriaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nueva categoría</h1>
      <CategoryForm />
    </div>
  )
}

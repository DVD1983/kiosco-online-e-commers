import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CategoryForm } from "@/components/admin/category-form"

export const dynamic = 'force-dynamic'
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarCategoriaPage({ params }: PageProps) {
  const { id } = await params
  const category = await prisma.category.findUnique({ where: { id } })

  if (!category) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar categoría</h1>
      <CategoryForm
        initialData={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          image: category.image,
        }}
      />
    </div>
  )
}

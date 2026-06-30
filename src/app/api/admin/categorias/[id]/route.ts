import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { categorySchema } from "@/lib/schemas"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()

    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        error: "Datos inválidos",
        details: parsed.error.flatten().fieldErrors,
      }, { status: 400 })
    }

    const { name, slug, image } = parsed.data

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, image: image || null },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Update category error:", error)
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const { id } = await params

    const productCount = await prisma.product.count({ where: { categoryId: id } })
    if (productCount > 0) {
      return NextResponse.json({
        error: `No se puede eliminar la categoría porque tiene ${productCount} producto(s) asociado(s)`,
      }, { status: 400 })
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}

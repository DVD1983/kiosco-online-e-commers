import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { productSchema } from "@/lib/schemas"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()

    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        error: "Datos inválidos",
        details: parsed.error.flatten().fieldErrors,
      }, { status: 400 })
    }

    const { name, slug, description, price, stock, featured, categoryId, images } = parsed.data

    const existing = await prisma.product.findFirst({ where: { slug, NOT: { id } } })
    if (existing) {
      return NextResponse.json({ error: "Ya existe otro producto con ese slug" }, { status: 409 })
    }

    const product = await prisma.product.update({
      where: { id },
      data: { name, slug, description, price, stock, featured, categoryId: categoryId || null, images },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}

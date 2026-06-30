import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
  slug: z.string().min(1, "El slug es requerido").max(200).regex(/^[a-z0-9-]+$/, "Slug inválido"),
  description: z.string().max(5000).default(""),
  price: z.number().positive("El precio debe ser positivo"),
  stock: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  categoryId: z.string().nullable().optional(),
  images: z.string().default("[]"),
})

export const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  slug: z.string().min(1, "El slug es requerido").max(100).regex(/^[a-z0-9-]+$/, "Slug inválido"),
  image: z.string().nullable().optional(),
})

export const checkoutSchema = z.object({
  customerName: z.string().min(1, "El nombre es requerido").max(200),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().max(50).optional().nullable(),
  shippingAddress: z.string().max(500).optional().nullable(),
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().int().positive("La cantidad debe ser positiva"),
  })).min(1, "Debe haber al menos un item"),
})

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "preparing", "sent", "delivered", "cancelled"]),
})

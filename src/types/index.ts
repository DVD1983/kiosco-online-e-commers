export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  slug: string
  stock: number
}

export type ProductWithCategory = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discount: number | null
  images: string
  stock: number
  featured: boolean
  categoryId: string | null
  category: { id: string; name: string; slug: string } | null
  createdAt: Date
}

export type OrderWithItems = {
  id: string
  total: number
  status: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  shippingAddress: string | null
  paymentId: string | null
  paymentStatus: string | null
  createdAt: Date
  items: {
    id: string
    quantity: number
    price: number
    product: { id: string; name: string; slug: string } | null
  }[]
}

export type CategoryWithCount = {
  id: string
  name: string
  slug: string
  image: string | null
  _count: { products: number }
}
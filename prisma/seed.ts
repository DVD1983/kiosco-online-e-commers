import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import bcrypt from "bcryptjs"

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  const password = await bcrypt.hash("admin123", 12)
  await prisma.adminUser.upsert({
    where: { email: "admin@kiosco.com" },
    update: {},
    create: {
      email: "admin@kiosco.com",
      name: "Admin Kiosco",
      password,
    },
  })

  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "golosinas" }, update: {}, create: { name: "Golosinas", slug: "golosinas" } }),
    prisma.category.upsert({ where: { slug: "bebidas" }, update: {}, create: { name: "Bebidas", slug: "bebidas" } }),
    prisma.category.upsert({ where: { slug: "snacks" }, update: {}, create: { name: "Snacks", slug: "snacks" } }),
    prisma.category.upsert({ where: { slug: "cigarrillos" }, update: {}, create: { name: "Cigarrillos", slug: "cigarrillos" } }),
    prisma.category.upsert({ where: { slug: "lacteos" }, update: {}, create: { name: "Lacteos", slug: "lacteos" } }),
  ])

  const products = [
    {
      name: "Coca-Cola 500ml",
      slug: "coca-cola-500ml",
      description: "Gaseosa Coca-Cola sabor original 500ml",
      price: 800, stock: 50, featured: true,
      categoryId: categories[1].id,
      images: '["https://rissodistribuidora.com.ar/wp-content/uploads/2023/03/Coca-500-510x509.jpg"]',
    },
    {
      name: "Sprite 500ml",
      slug: "sprite-500ml",
      description: "Gaseosa Sprite lima-limón 500ml",
      price: 800, stock: 40, featured: false,
      categoryId: categories[1].id,
      images: '["https://rissodistribuidora.com.ar/wp-content/uploads/2023/03/Sprite-500-510x509.jpg"]',
    },
    {
      name: "Agua Mineral Villavicencio 500ml",
      slug: "agua-mineral-500ml",
      description: "Agua mineral sin gas Villavicencio 500ml",
      price: 600, stock: 60, featured: false,
      categoryId: categories[1].id,
      images: '["https://dcdn-us.mitiendanube.com/stores/001/212/084/products/7799155000173-f795440877f7f5eb6617395737514052-480-0.webp"]',
    },
    {
      name: "Alfajor Tofi",
      slug: "alfajor-tofi",
      description: "Alfajor Tofi clásico",
      price: 500, stock: 100, featured: true,
      categoryId: categories[0].id,
      images: '["https://dcdn-us.mitiendanube.com/stores/001/602/042/products/0eecb4f5-51db-4955-a215-1a17ccbd2e50_nube-2b6fc94ef8703d656b16161888591640-640-0.webp"]',
    },
    {
      name: "Alfajor Guaymallén",
      slug: "alfajor-guaymallen",
      description: "Alfajor Guaymallén de chocolate 38g",
      price: 400, stock: 100, featured: false,
      categoryId: categories[0].id,
      images: '["https://acdn-us.mitiendanube.com/stores/006/158/583/products/guaymachocosimple-664c66e723ba2bcf3e17810203451849-480-0.webp"]',
    },
    {
      name: "Bon o Bon",
      slug: "bon-o-bon",
      description: "Bon o Bon blanco y negro x6",
      price: 1200, stock: 30, featured: true,
      categoryId: categories[0].id,
      images: '["https://acdn-us.mitiendanube.com/stores/002/609/727/products/401-db26863eb55797fe9916780419120892-640-0.webp"]',
    },
    {
      name: "Papas Lays 120g",
      slug: "papas-lays-120g",
      description: "Papas fritas Lays clásicas 120g",
      price: 1500, stock: 35, featured: false,
      categoryId: categories[2].id,
      images: '["https://www.appsuper.com.ar/wp-content/uploads/2020/05/Papas-Lays-clasicas-150-gr-600x645.jpg"]',
    },
    {
      name: "Cheetos 90g",
      slug: "cheetos-90g",
      description: "Cheetos queso 90g",
      price: 1200, stock: 40, featured: false,
      categoryId: categories[2].id,
      images: '["https://http2.mlstatic.com/D_NQ_NP_802865-MLU74883671332_032024-O.webp"]',
    },
    {
      name: "Marlboro Box",
      slug: "marlboro-box",
      description: "Atado Marlboro Box 20 unidades",
      price: 3500, stock: 80, featured: false,
      categoryId: categories[3].id,
      images: '["http://atencion24.ar/wp-content/uploads/2022/05/IMG_20220512_151327170-900x1125.jpg"]',
    },
    {
      name: "Leche La Serenísima 1L",
      slug: "leche-la-serenisima-1l",
      description: "Leche entera La Serenísima 1 litro",
      price: 1100, stock: 25, featured: false,
      categoryId: categories[4].id,
      images: '["https://www.appsuper.com.ar/wp-content/uploads/2019/11/leche-entera-la-serenisima-clasica-3-600x600.jpg"]',
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { images: product.images },
      create: product,
    })
  }

  console.log("Seed completed!")
  console.log("Admin login: admin@kiosco.com / admin123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
const a = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' })
const p = new PrismaClient({ adapter: a })
const cat = await p.category.findUnique({ where: { slug: 'cigarrillos' } })
console.log('name:', cat?.name)
console.log('image:', cat?.image)
await p.$disconnect()

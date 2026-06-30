# Kiosco Online 24H

> Pedí lo que quieras, no te muevas. E-commerce de kiosco con envíos gratis en Palermo, CABA.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Base de datos:** SQLite via Prisma (`better-sqlite3`)
- **Autenticación:** NextAuth v4 + bcryptjs
- **Pagos:** Mercado Pago SDK
- **UI:** Lucide React icons + Sonner toasts
- **Validación:** Zod v4
- **ORM:** Prisma v7

## Funcionalidades

- Catálogo de productos con categorías e imágenes
- Carrusel de descuentos con auto-slide
- Búsqueda y filtro por categoría
- Carrito de compras con persistencia (localStorage)
- Checkout integrado con Mercado Pago
- Panel admin con ABM de productos, categorías y pedidos
- Modo oscuro / claro
- Botón flotante de WhatsApp
- Diseño responsive (mobile-first)

## Requisitos

- Node.js 20+
- npm

## Instalación

```bash
git clone https://github.com/DVD1983/kiosco-online-e-commers.git
cd kiosco
npm install
```

## Configuración de entorno

Crear archivo `.env` en la raíz:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generar con: openssl rand -base64 32>"
MP_ACCESS_TOKEN="<token de Mercado Pago>"
```

## Base de datos

```bash
# Ejecutar migraciones
npx prisma migrate deploy

# (Opcional) Poblar con datos de ejemplo
npx tsx prisma/seed.ts
```

## Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Admin

| Ruta | Credenciales |
|---|---|
| `/admin` | `admin@kiosco.com` / `admin123` |

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir build |
| `npm run lint` | Linter ESLint |
| `npx tsx <archivo>` | Ejecutar script TypeScript |

## Contacto

- WhatsApp: [+54 11 5220-3679](https://wa.me/541152203679)

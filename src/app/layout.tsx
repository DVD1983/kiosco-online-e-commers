import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'
import { CartProvider } from '@/lib/cart-context'
import { ThemeProvider } from '@/lib/theme-context'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Kiosco Online 24 Horas - Pedí lo que quieras y no te muevas',
  description: 'Pedí lo que quieras y no te muevas. Golosinas, bebidas, snacks, cigarrillos y más. Abierto 24 horas en Palermo, CABA.',
  openGraph: {
    title: 'Kiosco Online 24 Horas',
    description: 'Pedí lo que quieras y no te muevas',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
        <WhatsAppButton />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
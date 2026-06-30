import { Store } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-primary mb-3">
              <Store className="size-5" />
              <span>Kiosco Online 24H</span>
            </div>
            <p className="text-sm text-muted">
              Ped&iacute; lo que quieras y no te muevas. Env&iacute;os gratis en Palermo, CABA. Abierto 24 horas.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Navegación</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/productos" className="hover:text-primary transition-colors">Productos</Link></li>
              <li><Link href="/carrito" className="hover:text-primary transition-colors">Carrito</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>Palermo, CABA</li>
              <li>WhatsApp: 11 5220-3679</li>
              <li>kiosco@online24hs.com.ar</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Kiosco Online 24H. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
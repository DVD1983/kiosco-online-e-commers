'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, Menu, X, Store, Sun, Moon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui'
import { useCart } from '@/lib/cart-context'
import { useTheme } from '@/lib/theme-context'

export function Header() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { items } = useCart()
  const { theme, toggleTheme } = useTheme()
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = search.trim()
    if (q) router.push('/productos?busqueda=' + encodeURIComponent(q))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold text-primary">
          <Store className="size-6" />
          <span className="hidden sm:inline">Kiosco Online 24H</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="h-9 w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-muted hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="/productos" className="text-sm font-medium text-muted hover:text-primary transition-colors">
            Productos
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                router.push('/productos')
              }
            }}
            className="rounded-lg p-2 text-muted hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:hidden"
            aria-label="Buscar"
          >
            <Search className="size-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>

          <Link href="/carrito" className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="size-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-surface md:hidden">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar productos..."
                  className="h-9 w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </form>
          </div>
          <nav className="flex flex-col gap-2 px-4 pb-4">
            <Link href="/" className="py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
            <Link href="/productos" className="py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>
              Productos
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

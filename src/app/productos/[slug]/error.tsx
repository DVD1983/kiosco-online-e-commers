"use client"

import { Button } from "@/components/ui"
import Link from "next/link"

export default function ProductoError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-danger">Error</h1>
      <h2 className="text-xl font-semibold">No pudimos cargar el producto</h2>
      <p className="text-muted">Ocurri&oacute; un error inesperado.</p>
      <div className="flex gap-3">
        <Button onClick={reset}>Reintentar</Button>
        <Link href="/productos">
          <Button variant="outline">Ver productos</Button>
        </Link>
      </div>
    </div>
  )
}

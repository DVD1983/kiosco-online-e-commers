"use client"

import { Button } from "@/components/ui"
import Link from "next/link"

export default function ProductosError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-danger">Error</h1>
      <h2 className="text-xl font-semibold">No pudimos cargar los productos</h2>
      <p className="text-muted">Ocurri&oacute; un error al obtener los productos. Intent&aacute; de nuevo.</p>
      <div className="flex gap-3">
        <Button onClick={reset}>Reintentar</Button>
        <Link href="/">
          <Button variant="outline">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}

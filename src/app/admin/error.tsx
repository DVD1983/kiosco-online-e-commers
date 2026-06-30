"use client"

import { Button } from "@/components/ui"

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-danger">Error</h1>
      <h2 className="text-xl font-semibold">Error en el panel admin</h2>
      <p className="text-muted">Ocurri&oacute; un error inesperado.</p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  )
}

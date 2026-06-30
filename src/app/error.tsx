"use client"

import { Button } from "@/components/ui"

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-danger">Error</h1>
      <h2 className="text-xl font-semibold">Algo sali&oacute; mal</h2>
      <p className="text-muted">Ocurri&oacute; un error inesperado. Intent&aacute; de nuevo.</p>
      <Button onClick={reset}>Intentar de nuevo</Button>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Coffee } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <Coffee className="h-16 w-16 text-primary mb-6 opacity-50" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-4">Página no encontrada</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        No encontramos lo que buscabas. Quizás el mate ya fue vendido o la URL cambió.
      </p>
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}

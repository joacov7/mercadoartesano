import Link from "next/link"
import { Coffee } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Coffee className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">MercadoArtesano</span>
            </div>
            <p className="text-sm text-muted-foreground">
              El mercado de mates artesanales de Argentina. Conectamos artesanos con amantes del mate.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Explorar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Galería de Mates</Link></li>
              <li><Link href="/explorar" className="hover:text-foreground transition-colors">Taller de Insumos</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Artesanos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/registro" className="hover:text-foreground transition-colors">Publicar mis productos</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Mi panel</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MercadoArtesano. Hecho con amor en Argentina 🧉</p>
        </div>
      </div>
    </footer>
  )
}

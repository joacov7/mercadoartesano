import { ProductGrid } from "@/components/productos/product-grid"
import type { ProductoConUsuario } from "@/types"

interface StoreGridProps {
  productos: ProductoConUsuario[]
  favoritosIds?: string[]
}

export function StoreGrid({ productos, favoritosIds = [] }: StoreGridProps) {
  return (
    <div className="container py-6">
      <h2 className="text-lg font-semibold mb-4">
        Productos ({productos.length})
      </h2>
      <ProductGrid productos={productos} favoritosIds={favoritosIds} />
    </div>
  )
}

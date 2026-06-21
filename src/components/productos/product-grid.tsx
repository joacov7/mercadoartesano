import { ProductCard } from "./product-card"
import type { ProductoConUsuario } from "@/types"

interface ProductGridProps {
  productos: ProductoConUsuario[]
  favoritosIds?: string[]
}

export function ProductGrid({ productos, favoritosIds = [] }: ProductGridProps) {
  if (productos.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl mb-4">🧉</p>
        <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
        <p className="text-muted-foreground text-sm">Probá con otros filtros o volvé más tarde</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          isFavorito={favoritosIds.includes(producto.id)}
        />
      ))}
    </div>
  )
}

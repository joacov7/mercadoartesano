"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FavoriteButton } from "@/components/shared/favorite-button"
import { formatPrice, getInitials } from "@/lib/utils"
import { CATEGORIA_LABELS, STOCK_ESTADO_LABELS } from "@/types"
import type { ProductoConUsuario } from "@/types"

interface ProductCardProps {
  producto: ProductoConUsuario
  isFavorito?: boolean
}

export function ProductCard({ producto, isFavorito = false }: ProductCardProps) {
  const mainImage = producto.fotosUrls[0] ?? "/placeholder-mate.jpg"
  const stockColor = {
    disponible: "bg-green-500",
    por_encargo: "bg-yellow-500",
    sin_stock: "bg-red-500",
  }[producto.stockEstado]

  return (
    <div className="group relative rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200">
      {/* Image */}
      <Link href={`/producto/${producto.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={mainImage}
            alt={producto.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {producto.destacado && (
              <Badge className="bg-mate-gold text-white border-0 text-xs px-1.5 py-0.5">
                <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                Destacado
              </Badge>
            )}
            <Badge className="bg-black/60 text-white border-0 text-xs px-1.5 py-0.5">
              {CATEGORIA_LABELS[producto.categoria]}
            </Badge>
          </div>
          {/* Price badge */}
          <div className="absolute bottom-2 right-2">
            <span className="bg-primary text-primary-foreground text-sm font-bold px-2 py-1 rounded-lg">
              {formatPrice(producto.precio)}
            </span>
          </div>
          {/* Favorite button */}
          <div className="absolute top-2 right-2">
            <FavoriteButton
              productoId={producto.id}
              initialIsFavorito={isFavorito}
              className="bg-black/30 hover:bg-black/50 text-white hover:text-white backdrop-blur-sm"
            />
          </div>
          {/* Stock indicator */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
            <span className={`h-1.5 w-1.5 rounded-full ${stockColor}`} />
            <span className="text-white text-xs">{STOCK_ESTADO_LABELS[producto.stockEstado]}</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3">
        <Link href={`/producto/${producto.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
            {producto.titulo}
          </h3>
        </Link>

        {/* Artisan info */}
        <Link href={`/tienda/${producto.usuario.username}`} className="flex items-center gap-2 group/artisan">
          <Avatar className="h-6 w-6">
            <AvatarImage src={producto.usuario.logoUrl ?? ""} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(producto.usuario.nombreMarca ?? producto.usuario.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate group-hover/artisan:text-primary transition-colors">
              {producto.usuario.nombreMarca ?? `@${producto.usuario.username}`}
            </p>
            {producto.usuario.provincia && (
              <p className="text-xs text-muted-foreground flex items-center gap-0.5">
                <MapPin className="h-2.5 w-2.5" />
                {producto.usuario.provincia}
              </p>
            )}
          </div>
          {producto.usuario.verificado && (
            <Star className="h-3 w-3 text-mate-gold fill-mate-gold shrink-0" />
          )}
        </Link>
      </div>
    </div>
  )
}

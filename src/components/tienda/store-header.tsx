"use client"

import Image from "next/image"
import { MapPin, Instagram, Star, Share2, BadgeCheck, Package, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { WhatsAppButton } from "@/components/shared/whatsapp-button"
import { FollowButton } from "@/components/shared/follow-button"
import { getInitials, formatDate } from "@/lib/utils"
import { ROL_LABELS } from "@/types"
import type { UsuarioPublico } from "@/types"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface StoreHeaderProps {
  artesano: UsuarioPublico
  isFollowing: boolean
}

export function StoreHeader({ artesano, isFollowing }: StoreHeaderProps) {
  const { data: session } = useSession()
  const isOwner = (session?.user as any)?.id === artesano.id

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: artesano.nombreMarca ?? artesano.username, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success("Enlace copiado")
    }
  }

  return (
    <div>
      {/* Banner */}
      <div className="relative h-40 sm:h-56 bg-gradient-to-br from-mate-green to-mate-green-light overflow-hidden">
        {artesano.bannerUrl && (
          <Image src={artesano.bannerUrl} alt="Banner" fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile section */}
      <div className="container relative">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16 pb-4">
          {/* Avatar */}
          <div className="relative z-10">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={artesano.logoUrl ?? ""} alt={artesano.username} />
              <AvatarFallback className="text-2xl sm:text-3xl bg-primary text-primary-foreground">
                {getInitials(artesano.nombreMarca ?? artesano.username)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2 sm:pt-0 sm:pb-2">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold truncate">
                {artesano.nombreMarca ?? `@${artesano.username}`}
              </h1>
              {artesano.verificado && (
                <BadgeCheck className="h-5 w-5 text-primary shrink-0" />
              )}
              <Badge variant="secondary" className="text-xs">
                {ROL_LABELS[artesano.rol]}
              </Badge>
            </div>

            {artesano.provincia && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                <MapPin className="h-3.5 w-3.5" />
                {artesano.localidad ? `${artesano.localidad}, ` : ""}{artesano.provincia}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5" />
                {artesano._count?.productos ?? 0} productos
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {artesano._count?.seguidores ?? 0} seguidores
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-mate-gold text-mate-gold" />
                {artesano.reputacionVotosPositivos} votos
              </span>
            </div>

            {artesano.biografia && (
              <p className="text-sm text-muted-foreground mb-3 max-w-xl">{artesano.biografia}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end sm:pb-2">
            {!isOwner && (
              <FollowButton
                artesanoId={artesano.id}
                initialIsFollowing={isFollowing}
                followersCount={artesano._count?.seguidores ?? 0}
              />
            )}
            <div className="flex gap-2">
              {artesano.instagram && (
                <a href={`https://instagram.com/${artesano.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </a>
              )}
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            {artesano.whatsapp && (
              <WhatsAppButton
                phone={artesano.whatsapp}
                message={`Hola! Te contacto desde MercadoArtesano, vi tu tienda "${artesano.nombreMarca ?? artesano.username}" y me interesa tu trabajo.`}
                label="Contactar"
                size="sm"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useOptimistic } from "react"
import { Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface FavoriteButtonProps {
  productoId: string
  initialIsFavorito: boolean
  count?: number
  showCount?: boolean
  className?: string
}

export function FavoriteButton({ productoId, initialIsFavorito, count = 0, showCount = false, className }: FavoriteButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [isFavorito, setIsFavorito] = useState(initialIsFavorito)
  const [localCount, setLocalCount] = useState(count)

  const handleToggle = async () => {
    if (!session) {
      router.push("/login")
      return
    }
    if (isPending) return

    const newState = !isFavorito
    setIsFavorito(newState)
    setLocalCount(prev => newState ? prev + 1 : Math.max(0, prev - 1))
    setIsPending(true)

    try {
      const response = await fetch("/api/favoritos", {
        method: newState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productoId }),
      })
      if (!response.ok) throw new Error()
      toast.success(newState ? "Agregado a favoritos" : "Eliminado de favoritos")
    } catch {
      setIsFavorito(!newState)
      setLocalCount(prev => newState ? Math.max(0, prev - 1) : prev + 1)
      toast.error("Error al actualizar favoritos")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 rounded-full", className)}
      onClick={handleToggle}
      disabled={isPending}
    >
      <Heart
        className={cn("h-4 w-4 transition-colors", isFavorito ? "fill-red-500 text-red-500" : "text-muted-foreground")}
      />
      {showCount && localCount > 0 && (
        <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
          {localCount}
        </span>
      )}
    </Button>
  )
}

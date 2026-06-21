"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus } from "lucide-react"
import { toast } from "sonner"

interface FollowButtonProps {
  artesanoId: string
  initialIsFollowing: boolean
  followersCount: number
  className?: string
}

export function FollowButton({ artesanoId, initialIsFollowing, followersCount, className }: FollowButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [count, setCount] = useState(followersCount)
  const [isPending, setIsPending] = useState(false)

  const handleToggle = async () => {
    if (!session) {
      router.push("/login")
      return
    }
    if (isPending) return

    const newState = !isFollowing
    setIsFollowing(newState)
    setCount(prev => newState ? prev + 1 : Math.max(0, prev - 1))
    setIsPending(true)

    try {
      const response = await fetch("/api/seguidores", {
        method: newState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artesanoId }),
      })
      if (!response.ok) throw new Error()
      toast.success(newState ? "Ahora seguís a este artesano" : "Dejaste de seguir al artesano")
    } catch {
      setIsFollowing(!newState)
      setCount(prev => newState ? Math.max(0, prev - 1) : prev + 1)
      toast.error("Error al actualizar")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Button
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        onClick={handleToggle}
        disabled={isPending}
        className="gap-1"
      >
        {isFollowing ? <UserMinus className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
        {isFollowing ? "Siguiendo" : "Seguir"}
      </Button>
      <span className="text-sm text-muted-foreground">{count} seguidores</span>
    </div>
  )
}

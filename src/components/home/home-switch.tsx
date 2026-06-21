"use client"

import { Coffee, Wrench } from "lucide-react"
import { useUIStore } from "@/store/ui-store"
import { cn } from "@/lib/utils"

export function HomeSwitchTab() {
  const { homeTab, setHomeTab } = useUIStore()

  return (
    <div className="flex justify-center mb-6">
      <div className="flex gap-1 bg-muted rounded-xl p-1 w-full max-w-sm">
        <button
          onClick={() => setHomeTab("mates")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
            homeTab === "mates"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Coffee className="h-4 w-4" />
          Galería de Mates
        </button>
        <button
          onClick={() => setHomeTab("insumos")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
            homeTab === "insumos"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Wrench className="h-4 w-4" />
          Taller de Insumos
        </button>
      </div>
    </div>
  )
}

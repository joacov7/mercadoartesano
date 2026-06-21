"use client"

import { Filter, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUIStore } from "@/store/ui-store"
import { PROVINCIAS_ARGENTINA, CATEGORIAS_MATES, CATEGORIAS_INSUMOS, CATEGORIA_LABELS, TIPO_VENTA_LABELS } from "@/types"
import { cn } from "@/lib/utils"

export function FiltersBar() {
  const { filters, homeTab, setFilter, resetFilters } = useUIStore()

  const categorias = homeTab === "mates" ? CATEGORIAS_MATES : CATEGORIAS_INSUMOS
  const hasActiveFilters = filters.provincia || filters.categoria || filters.tipoVenta || filters.orderBy !== "reciente"

  return (
    <div className="space-y-3 mb-6">
      {/* Province + order selects */}
      <div className="flex gap-2 flex-wrap">
        <Select value={filters.provincia || "all"} onValueChange={(v) => setFilter("provincia", v === "all" ? "" : v)}>
          <SelectTrigger className="w-auto min-w-[160px] h-9 text-sm">
            <SelectValue placeholder="Provincia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las provincias</SelectItem>
            {PROVINCIAS_ARGENTINA.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.tipoVenta || "all"} onValueChange={(v) => setFilter("tipoVenta", v === "all" ? "" : v)}>
          <SelectTrigger className="w-auto min-w-[140px] h-9 text-sm">
            <SelectValue placeholder="Tipo de venta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(TIPO_VENTA_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.orderBy || "reciente"} onValueChange={(v) => setFilter("orderBy", v)}>
          <SelectTrigger className="w-auto min-w-[140px] h-9 text-sm">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reciente">Más recientes</SelectItem>
            <SelectItem value="destacado">Destacados</SelectItem>
            <SelectItem value="precio_asc">Menor precio</SelectItem>
            <SelectItem value="precio_desc">Mayor precio</SelectItem>
            <SelectItem value="vistas">Más vistos</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 gap-1 text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilter("categoria", "")}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
            !filters.categoria
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
          )}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter("categoria", filters.categoria === cat ? "" : cat)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
              filters.categoria === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
            )}
          >
            {CATEGORIA_LABELS[cat]}
          </button>
        ))}
      </div>
    </div>
  )
}

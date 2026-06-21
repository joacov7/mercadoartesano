"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/store/ui-store"
import { useCallback, useState } from "react"

export function SearchBar() {
  const { filters, setFilter } = useUIStore()
  const [localSearch, setLocalSearch] = useState(filters.search)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFilter("search", localSearch)
  }

  const handleClear = () => {
    setLocalSearch("")
    setFilter("search", "")
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder="Buscar mates, artesanos, provincias..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="pl-9 pr-20"
      />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {localSearch && (
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleClear}>
            <X className="h-3 w-3" />
          </Button>
        )}
        <Button type="submit" size="sm" className="h-8 px-3">
          Buscar
        </Button>
      </div>
    </form>
  )
}

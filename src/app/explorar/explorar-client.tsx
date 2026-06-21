"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/productos/product-grid";
import { ProductGridSkeleton } from "@/components/productos/product-skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { CATEGORIA_LABELS, PROVINCIAS_ARGENTINA } from "@/types";
import type { ProductoConUsuario, Categoria } from "@/types";
import { cn } from "@/lib/utils";

export function ExplorarClient() {
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [provincia, setProvincia] = useState<string>("");
  const [orderBy, setOrderBy] = useState("reciente");
  const [localSearch, setLocalSearch] = useState("");

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (categoria) params.set("categoria", categoria);
  if (provincia) params.set("provincia", provincia);
  params.set("orderBy", orderBy);
  params.set("limit", "40");

  const { data, isLoading } = useQuery<{ productos: ProductoConUsuario[]; total: number }>({
    queryKey: ["explorar", search, categoria, provincia, orderBy],
    queryFn: async () => {
      const res = await fetch(`/api/productos?${params.toString()}`);
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearch);
  };

  const allCategorias = Object.entries(CATEGORIA_LABELS);

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-9 pr-20"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
          {localSearch && (
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setLocalSearch(""); setSearch(""); }}>
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button type="submit" size="sm" className="h-8 px-3">Buscar</Button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={provincia || "all"} onValueChange={(v) => setProvincia(v === "all" ? "" : v)}>
          <SelectTrigger className="w-auto min-w-[160px] h-9 text-sm">
            <SelectValue placeholder="Provincia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las provincias</SelectItem>
            {PROVINCIAS_ARGENTINA.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={orderBy} onValueChange={setOrderBy}>
          <SelectTrigger className="w-auto min-w-[140px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reciente">Más recientes</SelectItem>
            <SelectItem value="destacado">Destacados</SelectItem>
            <SelectItem value="precio_asc">Menor precio</SelectItem>
            <SelectItem value="precio_desc">Mayor precio</SelectItem>
            <SelectItem value="vistas">Más vistos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setCategoria("")}
          className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
            !categoria ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
          )}
        >
          Todos
        </button>
        {allCategorias.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCategoria(categoria === key ? "" : key)}
            className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
              categoria === key ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {data?.total !== undefined && (
        <p className="text-sm text-muted-foreground">
          {data.total} producto{data.total !== 1 ? "s" : ""} encontrado{data.total !== 1 ? "s" : ""}
        </p>
      )}

      {isLoading ? <ProductGridSkeleton count={12} /> : <ProductGrid productos={data?.productos ?? []} />}
    </div>
  );
}

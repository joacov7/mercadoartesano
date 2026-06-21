"use client";

import { useUIStore } from "@/store/ui-store";
import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/productos/product-grid";
import { ProductGridSkeleton } from "@/components/productos/product-skeleton";
import { CATEGORIAS_MATES, CATEGORIAS_INSUMOS } from "@/types";
import type { ProductoConUsuario } from "@/types";

export function HomeProductsSection() {
  const { homeTab, filters } = useUIStore();

  const queryParams = new URLSearchParams();
  if (filters.provincia) queryParams.set("provincia", filters.provincia);
  if (filters.categoria) queryParams.set("categoria", filters.categoria);
  if (filters.tipoVenta) queryParams.set("tipoVenta", filters.tipoVenta);
  if (filters.search) queryParams.set("search", filters.search);
  if (filters.orderBy) queryParams.set("orderBy", filters.orderBy);

  // Add tab-based category filter if no specific category selected
  if (!filters.categoria) {
    const cats = homeTab === "mates" ? CATEGORIAS_MATES : CATEGORIAS_INSUMOS;
    queryParams.set("categorias", cats.join(","));
  }

  const { data, isLoading, error } = useQuery<{ productos: ProductoConUsuario[]; total: number }>({
    queryKey: ["productos", homeTab, filters],
    queryFn: async () => {
      const res = await fetch(`/api/productos?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Error al cargar productos");
      return res.json();
    },
  });

  if (isLoading) return <ProductGridSkeleton />;
  if (error) return (
    <div className="text-center py-12">
      <p className="text-destructive">Error al cargar los productos. Por favor intentá de nuevo.</p>
    </div>
  );

  return (
    <div>
      {data?.total !== undefined && (
        <p className="text-sm text-muted-foreground mb-4">
          {data.total} producto{data.total !== 1 ? "s" : ""} encontrado{data.total !== 1 ? "s" : ""}
        </p>
      )}
      <ProductGrid productos={data?.productos ?? []} />
    </div>
  );
}

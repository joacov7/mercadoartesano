"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductoConUsuario, FiltrosProducto } from "@/types";

export function useProductos(filtros: FiltrosProducto = {}) {
  const params = new URLSearchParams();
  if (filtros.categoria) params.set("categoria", filtros.categoria);
  if (filtros.provincia) params.set("provincia", filtros.provincia);
  if (filtros.tipoVenta) params.set("tipoVenta", filtros.tipoVenta);
  if (filtros.search) params.set("search", filtros.search);
  if (filtros.orderBy) params.set("orderBy", filtros.orderBy);
  if (filtros.page) params.set("page", filtros.page.toString());
  if (filtros.limit) params.set("limit", filtros.limit.toString());

  return useQuery<{ productos: ProductoConUsuario[]; total: number; page: number; limit: number }>({
    queryKey: ["productos", filtros],
    queryFn: async () => {
      const res = await fetch(`/api/productos?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar productos");
      return res.json();
    },
  });
}

export function useProducto(id: string) {
  return useQuery<{ producto: ProductoConUsuario }>({
    queryKey: ["producto", id],
    queryFn: async () => {
      const res = await fetch(`/api/productos/${id}`);
      if (!res.ok) throw new Error("Producto no encontrado");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useDeleteProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

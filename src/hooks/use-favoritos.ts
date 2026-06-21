"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function useFavoritos() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["favoritos"],
    queryFn: async () => {
      const res = await fetch("/api/favoritos");
      if (!res.ok) throw new Error("Error al cargar favoritos");
      return res.json();
    },
    enabled: !!session,
  });
}

export function useToggleFavorito() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productoId, isFavorito }: { productoId: string; isFavorito: boolean }) => {
      const res = await fetch("/api/favoritos", {
        method: isFavorito ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productoId }),
      });
      if (!res.ok) throw new Error("Error al actualizar favorito");
      return res.json();
    },
    onSuccess: (_, { isFavorito }) => {
      queryClient.invalidateQueries({ queryKey: ["favoritos"] });
      toast.success(isFavorito ? "Eliminado de favoritos" : "Agregado a favoritos");
    },
    onError: () => {
      toast.error("Error al actualizar favoritos");
    },
  });
}

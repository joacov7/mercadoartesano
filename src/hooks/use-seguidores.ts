"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useToggleSeguidor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ artesanoId, isFollowing }: { artesanoId: string; isFollowing: boolean }) => {
      const res = await fetch("/api/seguidores", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artesanoId }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      return res.json();
    },
    onSuccess: (_, { isFollowing }) => {
      queryClient.invalidateQueries({ queryKey: ["tienda"] });
      toast.success(isFollowing ? "Dejaste de seguir al artesano" : "Ahora seguís a este artesano");
    },
    onError: () => {
      toast.error("Error al actualizar");
    },
  });
}

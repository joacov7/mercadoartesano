import { z } from "zod";

export const createPedidoSchema = z.object({
  productoId: z.string().cuid("ID de producto inválido"),
});

export const updatePedidoSchema = z.object({
  estado: z.enum(["pendiente", "entregado", "cancelado"]),
});

export type CreatePedidoFormValues = z.infer<typeof createPedidoSchema>;
export type UpdatePedidoFormValues = z.infer<typeof updatePedidoSchema>;

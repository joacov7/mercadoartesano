"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { generateQRDataURL, buildPedidoUrl } from "@/lib/qr";
import { revalidatePath } from "next/cache";

export async function createPedido(productoId: string) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado" };

  const userId = (session.user as any).id;

  const producto = await prisma.producto.findUnique({
    where: { id: productoId, activo: true },
  });

  if (!producto) return { error: "Producto no encontrado" };
  if (producto.usuarioId === userId) return { error: "No podés comprar tu propio producto" };
  if (producto.stockEstado === "sin_stock") return { error: "Producto sin stock" };

  // Check for existing pending order
  const existing = await prisma.pedido.findFirst({
    where: { compradorId: userId, productoId, estado: "pendiente" },
  });

  if (existing) {
    const pedidoUrl = buildPedidoUrl(existing.codigoQrHash);
    const qrDataUrl = await generateQRDataURL(pedidoUrl);
    return { success: true, pedido: existing, qrDataUrl };
  }

  const codigoQrHash = nanoid(12);

  const pedido = await prisma.pedido.create({
    data: {
      compradorId: userId,
      vendedorId: producto.usuarioId,
      productoId,
      codigoQrHash,
    },
  });

  const pedidoUrl = buildPedidoUrl(codigoQrHash);
  const qrDataUrl = await generateQRDataURL(pedidoUrl);

  revalidatePath("/dashboard/pedidos");

  return { success: true, pedido, qrDataUrl };
}

export async function confirmarEntrega(pedidoId: string) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado" };

  const userId = (session.user as any).id;

  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido) return { error: "Pedido no encontrado" };
  if (pedido.vendedorId !== userId) return { error: "Solo el vendedor puede confirmar la entrega" };
  if (pedido.estado !== "pendiente") return { error: "El pedido no está en estado pendiente" };

  const [updated] = await Promise.all([
    prisma.pedido.update({ where: { id: pedidoId }, data: { estado: "entregado" } }),
    prisma.usuario.update({
      where: { id: userId },
      data: {
        reputacionVotosPositivos: { increment: 1 },
        entregasConfirmadas: { increment: 1 },
      },
    }),
  ]);

  revalidatePath("/dashboard/pedidos");

  return { success: true, pedido: updated };
}

export async function cancelarPedido(pedidoId: string) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado" };

  const userId = (session.user as any).id;

  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
  if (!pedido) return { error: "Pedido no encontrado" };

  if (pedido.compradorId !== userId && pedido.vendedorId !== userId) {
    return { error: "Sin permiso" };
  }

  if (pedido.estado !== "pendiente") return { error: "El pedido no se puede cancelar" };

  const updated = await prisma.pedido.update({
    where: { id: pedidoId },
    data: { estado: "cancelado" },
  });

  revalidatePath("/dashboard/pedidos");

  return { success: true, pedido: updated };
}

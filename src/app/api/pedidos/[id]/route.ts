import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const body = await req.json();
    const { estado } = body;

    if (!["pendiente", "entregado", "cancelado"].includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const pedido = await prisma.pedido.findUnique({ where: { id } });
    if (!pedido) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    // Only seller can mark as delivered, buyer or seller can cancel
    if (estado === "entregado" && pedido.vendedorId !== userId) {
      return NextResponse.json({ error: "Solo el vendedor puede confirmar la entrega" }, { status: 403 });
    }

    if (estado === "cancelado" && pedido.compradorId !== userId && pedido.vendedorId !== userId) {
      return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
    }

    const updated = await prisma.pedido.update({
      where: { id },
      data: { estado },
    });

    // If delivered, increment reputation and entregas for seller
    if (estado === "entregado") {
      await prisma.usuario.update({
        where: { id: pedido.vendedorId },
        data: {
          reputacionVotosPositivos: { increment: 1 },
          entregasConfirmadas: { increment: 1 },
        },
      });
    }

    return NextResponse.json({ pedido: updated });
  } catch (error) {
    console.error("PATCH /api/pedidos/[id] error:", error);
    return NextResponse.json({ error: "Error al actualizar pedido" }, { status: 500 });
  }
}

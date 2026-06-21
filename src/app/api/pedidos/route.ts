import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { generateQRDataURL, buildPedidoUrl } from "@/lib/qr";
import { z } from "zod";

const createPedidoSchema = z.object({
  productoId: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo") ?? "vendedor";

    const pedidos = await prisma.pedido.findMany({
      where: tipo === "comprador" ? { compradorId: userId } : { vendedorId: userId },
      include: {
        comprador: { select: { id: true, username: true, nombreMarca: true } },
        vendedor: { select: { id: true, username: true, nombreMarca: true, whatsapp: true } },
        producto: { select: { id: true, titulo: true, precio: true, fotosUrls: true, categoria: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const pedidosSerializable = pedidos.map((p) => ({
      ...p,
      producto: { ...p.producto, precio: p.producto.precio.toString() },
    }));

    return NextResponse.json({ pedidos: pedidosSerializable });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const parsed = createPedidoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const { productoId } = parsed.data;

    const producto = await prisma.producto.findUnique({
      where: { id: productoId, activo: true },
      include: { usuario: { select: { whatsapp: true, username: true, nombreMarca: true } } },
    });

    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    if (producto.usuarioId === userId) {
      return NextResponse.json({ error: "No podés comprar tu propio producto" }, { status: 400 });
    }

    if (producto.stockEstado === "sin_stock") {
      return NextResponse.json({ error: "Producto sin stock" }, { status: 400 });
    }

    // Check for existing pending order
    const existing = await prisma.pedido.findFirst({
      where: { compradorId: userId, productoId, estado: "pendiente" },
    });

    if (existing) {
      const pedidoUrl = buildPedidoUrl(existing.codigoQrHash);
      const qrDataUrl = await generateQRDataURL(pedidoUrl);
      return NextResponse.json({
        pedido: { ...existing },
        qrDataUrl,
        codigoQrHash: existing.codigoQrHash,
        whatsappVendedor: producto.usuario.whatsapp,
      });
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

    return NextResponse.json({
      pedido,
      qrDataUrl,
      codigoQrHash,
      whatsappVendedor: producto.usuario.whatsapp,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/pedidos error:", error);
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 });
  }
}

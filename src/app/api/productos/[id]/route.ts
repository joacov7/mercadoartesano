import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProductoSchema } from "@/lib/validations/producto";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
            nombreMarca: true,
            logoUrl: true,
            provincia: true,
            localidad: true,
            whatsapp: true,
            verificado: true,
            reputacionVotosPositivos: true,
            entregasConfirmadas: true,
          },
        },
        _count: { select: { favoritos: true } },
      },
    });

    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ producto: { ...producto, precio: producto.precio.toString() } });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const userRol = (session.user as any).rol;

    const producto = await prisma.producto.findUnique({ where: { id } });
    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    if (producto.usuarioId !== userId && userRol !== "admin") {
      return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateProductoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const updated = await prisma.producto.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ producto: { ...updated, precio: updated.precio.toString() } });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const userRol = (session.user as any).rol;

    const producto = await prisma.producto.findUnique({ where: { id } });
    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    if (producto.usuarioId !== userId && userRol !== "admin") {
      return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
    }

    await prisma.producto.update({ where: { id }, data: { activo: false } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const favoritos = await prisma.favorito.findMany({
      where: { usuarioId: userId },
      include: {
        producto: {
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
              },
            },
            _count: { select: { favoritos: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ favoritos });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener favoritos" }, { status: 500 });
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
    const { productoId } = body;

    if (!productoId) {
      return NextResponse.json({ error: "productoId es requerido" }, { status: 400 });
    }

    const favorito = await prisma.favorito.upsert({
      where: { usuarioId_productoId: { usuarioId: userId, productoId } },
      create: { usuarioId: userId, productoId },
      update: {},
    });

    return NextResponse.json({ favorito }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al agregar favorito" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { productoId } = body;

    await prisma.favorito.deleteMany({
      where: { usuarioId: userId, productoId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar favorito" }, { status: 500 });
  }
}

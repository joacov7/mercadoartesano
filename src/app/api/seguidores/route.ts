import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { artesanoId } = body;

    if (!artesanoId) {
      return NextResponse.json({ error: "artesanoId es requerido" }, { status: 400 });
    }

    if (userId === artesanoId) {
      return NextResponse.json({ error: "No podés seguirte a vos mismo" }, { status: 400 });
    }

    const seguidor = await prisma.seguidor.upsert({
      where: { usuarioId_artesanoId: { usuarioId: userId, artesanoId } },
      create: { usuarioId: userId, artesanoId },
      update: {},
    });

    return NextResponse.json({ seguidor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al seguir" }, { status: 500 });
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
    const { artesanoId } = body;

    await prisma.seguidor.deleteMany({
      where: { usuarioId: userId, artesanoId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al dejar de seguir" }, { status: 500 });
  }
}

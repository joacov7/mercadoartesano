import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).rol !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const rol = searchParams.get("rol") as any;

    const where: any = {};
    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { nombreMarca: { contains: search, mode: "insensitive" } },
      ];
    }
    if (rol) where.rol = rol;

    const usuarios = await prisma.usuario.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        nombreMarca: true,
        logoUrl: true,
        rol: true,
        plan: true,
        verificado: true,
        activo: true,
        provincia: true,
        reputacionVotosPositivos: true,
        entregasConfirmadas: true,
        createdAt: true,
        _count: { select: { productos: true, pedidosComoVendedor: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ usuarios });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).rol !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, activo, verificado, plan, rol } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId requerido" }, { status: 400 });
    }

    const data: any = {};
    if (activo !== undefined) data.activo = activo;
    if (verificado !== undefined) data.verificado = verificado;
    if (plan) data.plan = plan;
    if (rol) data.rol = rol;

    const updated = await prisma.usuario.update({ where: { id: userId }, data });

    return NextResponse.json({ usuario: updated });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
  }
}

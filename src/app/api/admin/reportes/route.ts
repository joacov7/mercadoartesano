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
    const estado = searchParams.get("estado") as any;

    const reportes = await prisma.reporte.findMany({
      where: estado ? { estado } : undefined,
      include: {
        reportante: { select: { id: true, username: true, nombreMarca: true } },
        reportado: { select: { id: true, username: true, nombreMarca: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reportes });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener reportes" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).rol !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { reporteId, estado } = body;

    if (!reporteId || !estado) {
      return NextResponse.json({ error: "reporteId y estado son requeridos" }, { status: 400 });
    }

    const updated = await prisma.reporte.update({
      where: { id: reporteId },
      data: { estado },
    });

    return NextResponse.json({ reporte: updated });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar reporte" }, { status: 500 });
  }
}

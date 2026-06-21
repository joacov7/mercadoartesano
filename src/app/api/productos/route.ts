import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productoSchema } from "@/lib/validations/producto";
import type { Categoria, TipoVenta } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get("categoria") as Categoria | null;
    const categorias = searchParams.get("categorias");
    const provincia = searchParams.get("provincia");
    const tipoVenta = searchParams.get("tipoVenta") as TipoVenta | null;
    const search = searchParams.get("search");
    const orderBy = searchParams.get("orderBy") ?? "reciente";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
    const skip = (page - 1) * limit;

    const where: any = { activo: true };

    if (categoria) {
      where.categoria = categoria;
    } else if (categorias) {
      where.categoria = { in: categorias.split(",") as Categoria[] };
    }

    if (provincia) {
      where.usuario = { provincia };
    }

    if (tipoVenta) {
      where.tipoVenta = { in: [tipoVenta, "ambos"] };
    }

    if (search) {
      where.OR = [
        { titulo: { contains: search, mode: "insensitive" } },
        { descripcion: { contains: search, mode: "insensitive" } },
        { usuario: { nombreMarca: { contains: search, mode: "insensitive" } } },
        { usuario: { username: { contains: search, mode: "insensitive" } } },
        { usuario: { provincia: { contains: search, mode: "insensitive" } } },
      ];
    }

    let orderByClause: any = { createdAt: "desc" };
    if (orderBy === "precio_asc") orderByClause = { precio: "asc" };
    else if (orderBy === "precio_desc") orderByClause = { precio: "desc" };
    else if (orderBy === "vistas") orderByClause = { vistas: "desc" };
    else if (orderBy === "destacado") orderByClause = [{ destacado: "desc" }, { createdAt: "desc" }];

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
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
          _count: {
            select: { favoritos: true, pedidos: true },
          },
        },
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      prisma.producto.count({ where }),
    ]);

    const productosSerializable = productos.map((p) => ({
      ...p,
      precio: p.precio.toString(),
    }));

    return NextResponse.json({ productos: productosSerializable, total, page, limit });
  } catch (error) {
    console.error("GET /api/productos error:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
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
    const parsed = productoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const producto = await prisma.producto.create({
      data: {
        ...parsed.data,
        usuarioId: userId,
      },
    });

    return NextResponse.json({ producto: { ...producto, precio: producto.precio.toString() } }, { status: 201 });
  } catch (error) {
    console.error("POST /api/productos error:", error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}

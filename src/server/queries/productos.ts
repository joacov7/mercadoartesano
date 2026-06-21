import { prisma } from "@/lib/prisma";
import type { Categoria, TipoVenta } from "@prisma/client";

export interface GetProductosOptions {
  categoria?: Categoria;
  categorias?: Categoria[];
  provincia?: string;
  tipoVenta?: TipoVenta;
  search?: string;
  orderBy?: "reciente" | "precio_asc" | "precio_desc" | "vistas" | "destacado";
  page?: number;
  limit?: number;
  usuarioId?: string;
  activo?: boolean;
}

export async function getProductos(options: GetProductosOptions = {}) {
  const {
    categoria,
    categorias,
    provincia,
    tipoVenta,
    search,
    orderBy = "reciente",
    page = 1,
    limit = 20,
    usuarioId,
    activo = true,
  } = options;

  const skip = (page - 1) * limit;
  const where: any = { activo };

  if (categoria) where.categoria = categoria;
  else if (categorias && categorias.length > 0) where.categoria = { in: categorias };

  if (usuarioId) where.usuarioId = usuarioId;

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
        _count: { select: { favoritos: true, pedidos: true } },
      },
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
    prisma.producto.count({ where }),
  ]);

  return {
    productos: productos.map(p => ({ ...p, precio: p.precio.toString() })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

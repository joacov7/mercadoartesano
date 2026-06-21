import { prisma } from "@/lib/prisma";

export async function getTiendaByUsername(username: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { username, activo: true },
    include: {
      _count: {
        select: {
          productos: { where: { activo: true } },
          seguidores: true,
          siguiendo: true,
        },
      },
    },
  });
  return usuario;
}

export async function getProductosByTienda(usuarioId: string) {
  const productos = await prisma.producto.findMany({
    where: { usuarioId, activo: true },
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
    orderBy: [{ destacado: "desc" }, { createdAt: "desc" }],
  });

  return productos.map(p => ({ ...p, precio: p.precio.toString() }));
}

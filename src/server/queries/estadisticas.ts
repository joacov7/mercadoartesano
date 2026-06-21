import { prisma } from "@/lib/prisma";

export async function getEstadisticasDashboard(userId: string) {
  const [totalProductos, pedidos, vistas, favoritos] = await Promise.all([
    prisma.producto.count({ where: { usuarioId: userId, activo: true } }),
    prisma.pedido.groupBy({
      by: ["estado"],
      where: { vendedorId: userId },
      _count: { id: true },
    }),
    prisma.producto.aggregate({
      where: { usuarioId: userId },
      _sum: { vistas: true },
    }),
    prisma.favorito.count({
      where: { producto: { usuarioId: userId } },
    }),
  ]);

  return {
    totalProductos,
    totalPedidos: pedidos.reduce((sum, p) => sum + p._count.id, 0),
    pedidosPendientes: pedidos.find(p => p.estado === "pendiente")?._count.id ?? 0,
    pedidosEntregados: pedidos.find(p => p.estado === "entregado")?._count.id ?? 0,
    totalVistas: vistas._sum.vistas ?? 0,
    totalFavoritos: favoritos,
  };
}

export async function getEstadisticasAdmin() {
  const [totalUsuarios, totalProductos, totalPedidos, reportesPendientes, usuariosPorRol] = await Promise.all([
    prisma.usuario.count(),
    prisma.producto.count(),
    prisma.pedido.count(),
    prisma.reporte.count({ where: { estado: "pendiente" } }),
    prisma.usuario.groupBy({ by: ["rol"], _count: { id: true } }),
  ]);

  return {
    totalUsuarios,
    totalProductos,
    totalPedidos,
    reportesPendientes,
    usuariosPorRol,
  };
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Eye, Heart, Plus, ArrowRight, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session!.user as any).id;

  const [totalProductos, totalPedidosVendedor, totalPedidosComprador, vistas, favoritos, ultimosPedidos] = await Promise.all([
    prisma.producto.count({ where: { usuarioId: userId, activo: true } }),
    prisma.pedido.count({ where: { vendedorId: userId } }),
    prisma.pedido.count({ where: { compradorId: userId } }),
    prisma.producto.aggregate({ where: { usuarioId: userId }, _sum: { vistas: true } }),
    prisma.favorito.count({ where: { producto: { usuarioId: userId } } }),
    prisma.pedido.findMany({
      where: { vendedorId: userId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        comprador: { select: { username: true, nombreMarca: true } },
        producto: { select: { titulo: true, precio: true } },
      },
    }),
  ]);

  const stats = [
    { title: "Productos activos", value: totalProductos, icon: Package, color: "text-primary" },
    { title: "Ventas realizadas", value: totalPedidosVendedor, icon: ShoppingBag, color: "text-green-600" },
    { title: "Vistas totales", value: vistas._sum.vistas ?? 0, icon: Eye, color: "text-blue-600" },
    { title: "Me gusta recibidos", value: favoritos, icon: Heart, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mi panel</h1>
        <Button asChild>
          <Link href="/dashboard/productos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ title, value, icon: Icon, color }) => (
          <Card key={title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{title}</p>
                  <p className="text-2xl font-bold">{value.toLocaleString("es-AR")}</p>
                </div>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Últimos pedidos recibidos</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/pedidos" className="gap-1">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {ultimosPedidos.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-4">No hay pedidos aún</p>
          ) : (
            <div className="space-y-3">
              {ultimosPedidos.map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{pedido.producto.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                      Comprador: @{pedido.comprador.username}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(pedido.producto.precio)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      pedido.estado === "entregado" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                      pedido.estado === "cancelado" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}>
                      {pedido.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

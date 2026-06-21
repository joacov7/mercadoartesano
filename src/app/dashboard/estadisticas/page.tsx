import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, ShoppingBag, Star, TrendingUp, Package } from "lucide-react";
import { CATEGORIA_LABELS } from "@/types";
import type { Categoria } from "@/types";

export default async function EstadisticasPage() {
  const session = await auth();
  const userId = (session!.user as any).id;

  const [usuario, productos, pedidos, viewsByDay] = await Promise.all([
    prisma.usuario.findUnique({ where: { id: userId }, select: { reputacionVotosPositivos: true, entregasConfirmadas: true, plan: true, verificado: true } }),
    prisma.producto.findMany({
      where: { usuarioId: userId, activo: true },
      select: { id: true, titulo: true, vistas: true, categoria: true, _count: { select: { favoritos: true, pedidos: true } } },
      orderBy: { vistas: "desc" },
      take: 10,
    }),
    prisma.pedido.groupBy({
      by: ["estado"],
      where: { vendedorId: userId },
      _count: { id: true },
    }),
    prisma.productView.groupBy({
      by: ["createdAt"],
      where: { producto: { usuarioId: userId } },
      _count: { id: true },
      orderBy: { createdAt: "desc" },
      take: 7,
    }),
  ]);

  const totalVistas = productos.reduce((sum, p) => sum + p.vistas, 0);
  const totalFavoritos = productos.reduce((sum, p) => sum + p._count.favoritos, 0);
  const pedidosPendientes = pedidos.find(p => p.estado === "pendiente")?._count.id ?? 0;
  const pedidosEntregados = pedidos.find(p => p.estado === "entregado")?._count.id ?? 0;

  const byCategoria = productos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estadísticas</h1>

      {/* Reputation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tu reputación</p>
              <p className="text-3xl font-bold text-primary mt-1">{usuario?.reputacionVotosPositivos ?? 0}</p>
              <p className="text-xs text-muted-foreground">votos positivos</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{usuario?.entregasConfirmadas ?? 0} entregas</p>
              <Badge className="mt-1">{usuario?.plan?.toUpperCase() ?? "FREE"}</Badge>
              {usuario?.verificado && <Badge className="mt-1 ml-1 bg-blue-500">Verificado</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Vistas totales", value: totalVistas, icon: Eye, color: "text-blue-500" },
          { label: "Favoritos recibidos", value: totalFavoritos, icon: Heart, color: "text-red-500" },
          { label: "Pedidos pendientes", value: pedidosPendientes, icon: ShoppingBag, color: "text-yellow-500" },
          { label: "Entregas confirmadas", value: pedidosEntregados, icon: Star, color: "text-green-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <Icon className={`h-5 w-5 ${color} mb-2`} />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top products */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Productos más vistos</CardTitle></CardHeader>
        <CardContent>
          {productos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No hay productos aún</p>
          ) : (
            <div className="space-y-3">
              {productos.slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.titulo}</p>
                    <p className="text-xs text-muted-foreground">{CATEGORIA_LABELS[p.categoria as Categoria]}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                    <span>{p.vistas} 👁️</span>
                    <span>{p._count.favoritos} ❤️</span>
                    <span>{p._count.pedidos} 🛒</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* By category */}
      {Object.keys(byCategoria).length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Productos por categoría</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(byCategoria).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">{CATEGORIA_LABELS[cat as Categoria]}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

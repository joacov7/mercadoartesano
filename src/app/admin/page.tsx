import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingBag, Flag, TrendingUp } from "lucide-react";
import { CATEGORIA_LABELS, ROL_LABELS } from "@/types";
import type { Categoria, Rol } from "@/types";

export default async function AdminPage() {
  const [totalUsuarios, totalProductos, totalPedidos, reportesPendientes, usuariosPorRol, productosPorCategoria] = await Promise.all([
    prisma.usuario.count(),
    prisma.producto.count(),
    prisma.pedido.count(),
    prisma.reporte.count({ where: { estado: "pendiente" } }),
    prisma.usuario.groupBy({ by: ["rol"], _count: { id: true } }),
    prisma.producto.groupBy({ by: ["categoria"], _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 5 }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Administración</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Usuarios totales", value: totalUsuarios, icon: Users, color: "text-blue-500" },
          { label: "Productos", value: totalProductos, icon: Package, color: "text-primary" },
          { label: "Pedidos", value: totalPedidos, icon: ShoppingBag, color: "text-green-500" },
          { label: "Reportes pendientes", value: reportesPendientes, icon: Flag, color: "text-red-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <Icon className={`h-5 w-5 ${color} mb-2`} />
              <p className="text-2xl font-bold">{value.toLocaleString("es-AR")}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Usuarios por rol</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usuariosPorRol.map(({ rol, _count }) => (
                <div key={rol} className="flex items-center justify-between">
                  <span className="text-sm">{ROL_LABELS[rol as Rol]}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (_count.id / totalUsuarios) * 100)}%` }} />
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{_count.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Top categorías</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productosPorCategoria.map(({ categoria, _count }) => (
                <div key={categoria} className="flex items-center justify-between">
                  <span className="text-sm">{CATEGORIA_LABELS[categoria as Categoria]}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (_count.id / totalProductos) * 100)}%` }} />
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{_count.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

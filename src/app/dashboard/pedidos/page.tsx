import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { ConfirmEntregaButton } from "./confirm-entrega-button";

export default async function DashboardPedidosPage() {
  const session = await auth();
  const userId = (session!.user as any).id;

  const [pedidosVendedor, pedidosComprador] = await Promise.all([
    prisma.pedido.findMany({
      where: { vendedorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        comprador: { select: { username: true, nombreMarca: true } },
        producto: { select: { titulo: true, precio: true, fotosUrls: true } },
      },
    }),
    prisma.pedido.findMany({
      where: { compradorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        vendedor: { select: { username: true, nombreMarca: true, whatsapp: true } },
        producto: { select: { titulo: true, precio: true, fotosUrls: true } },
      },
    }),
  ]);

  const estadoBadge = (estado: string) => {
    const variants: Record<string, string> = {
      pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      entregado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cancelado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    const labels: Record<string, string> = { pendiente: "Pendiente", entregado: "Entregado", cancelado: "Cancelado" };
    return <span className={`text-xs px-2 py-1 rounded-full font-medium ${variants[estado]}`}>{labels[estado]}</span>;
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Pedidos</h1>

      {/* Ventas */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Ventas recibidas ({pedidosVendedor.length})</h2>
        {pedidosVendedor.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8 border rounded-xl">No tenés ventas aún</p>
        ) : (
          <div className="space-y-3">
            {pedidosVendedor.map((pedido) => (
              <Card key={pedido.id}>
                <CardContent className="flex gap-4 p-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    {pedido.producto.fotosUrls[0] && (
                      <Image src={pedido.producto.fotosUrls[0]} alt={pedido.producto.titulo} fill className="object-cover" sizes="64px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{pedido.producto.titulo}</p>
                    <p className="text-xs text-muted-foreground">Comprador: @{pedido.comprador.username}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(pedido.createdAt)}</p>
                    <p className="text-sm font-bold text-primary mt-1">{formatPrice(pedido.producto.precio)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {estadoBadge(pedido.estado)}
                    {pedido.estado === "pendiente" && (
                      <ConfirmEntregaButton pedidoId={pedido.id} compradorId={pedido.compradorId} />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Compras */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Mis compras ({pedidosComprador.length})</h2>
        {pedidosComprador.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8 border rounded-xl">No realizaste compras aún</p>
        ) : (
          <div className="space-y-3">
            {pedidosComprador.map((pedido) => (
              <Card key={pedido.id}>
                <CardContent className="flex gap-4 p-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    {pedido.producto.fotosUrls[0] && (
                      <Image src={pedido.producto.fotosUrls[0]} alt={pedido.producto.titulo} fill className="object-cover" sizes="64px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{pedido.producto.titulo}</p>
                    <p className="text-xs text-muted-foreground">Vendedor: @{pedido.vendedor.username}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(pedido.createdAt)}</p>
                    <p className="text-sm font-bold text-primary mt-1">{formatPrice(pedido.producto.precio)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {estadoBadge(pedido.estado)}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/pedido/${pedido.codigoQrHash}`}>Ver QR</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

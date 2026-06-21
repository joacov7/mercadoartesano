import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, Trash2, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CATEGORIA_LABELS, STOCK_ESTADO_LABELS } from "@/types";
import { DeleteProductButton } from "./delete-product-button";

export default async function DashboardProductosPage() {
  const session = await auth();
  const userId = (session!.user as any).id;

  const productos = await prisma.producto.findMany({
    where: { usuarioId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { favoritos: true, pedidos: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis productos</h1>
          <p className="text-sm text-muted-foreground">{productos.length} producto{productos.length !== 1 ? "s" : ""}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/productos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <p className="text-4xl mb-4">🧉</p>
          <h3 className="text-lg font-semibold mb-2">Aún no tenés productos</h3>
          <p className="text-muted-foreground text-sm mb-4">Publicá tu primer mate artesanal</p>
          <Button asChild>
            <Link href="/dashboard/productos/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Publicar producto
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {productos.map((producto) => (
            <Card key={producto.id}>
              <CardContent className="flex gap-4 p-4">
                {/* Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  {producto.fotosUrls[0] && (
                    <Image src={producto.fotosUrls[0]} alt={producto.titulo} fill className="object-cover" sizes="80px" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{producto.titulo}</p>
                        {producto.destacado && <Star className="h-3.5 w-3.5 text-mate-gold fill-mate-gold shrink-0" />}
                        {!producto.activo && <Badge variant="destructive" className="text-xs">Inactivo</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <Badge variant="secondary" className="text-xs">{CATEGORIA_LABELS[producto.categoria]}</Badge>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          producto.stockEstado === "disponible" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                          producto.stockEstado === "sin_stock" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}>{STOCK_ESTADO_LABELS[producto.stockEstado]}</span>
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>{producto._count.favoritos} ❤️</span>
                        <span>{producto._count.pedidos} pedidos</span>
                        <span>{producto.vistas} vistas</span>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-primary shrink-0">{formatPrice(producto.precio)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/producto/${producto.id}`} target="_blank">
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/dashboard/productos/${producto.id}/editar`}>
                      <Edit className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <DeleteProductButton productId={producto.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

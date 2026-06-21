import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { generateQRDataURL, buildPedidoUrl } from "@/lib/qr";
import { QRDisplay } from "@/components/shared/qr-display";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";

interface PageProps {
  params: Promise<{ codigo: string }>;
}

export const metadata: Metadata = {
  title: "Detalle del pedido",
};

const ESTADO_PEDIDO_LABELS = {
  pendiente: "Pendiente",
  entregado: "Entregado",
  cancelado: "Cancelado",
} as const;

export default async function PedidoPage({ params }: PageProps) {
  const { codigo } = await params;

  const pedido = await prisma.pedido.findUnique({
    where: { codigoQrHash: codigo },
    include: {
      comprador: { select: { id: true, username: true, nombreMarca: true } },
      vendedor: { select: { id: true, username: true, nombreMarca: true, whatsapp: true } },
      producto: { select: { id: true, titulo: true, precio: true, fotosUrls: true, categoria: true } },
    },
  });

  if (!pedido) notFound();

  const pedidoUrl = buildPedidoUrl(pedido.codigoQrHash);
  const qrDataUrl = await generateQRDataURL(pedidoUrl);

  const estadoVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pendiente: "secondary",
    entregado: "default",
    cancelado: "destructive",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">Detalle del pedido</h1>
            <p className="text-muted-foreground text-sm">Fecha: {formatDate(pedido.createdAt)}</p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Estado del pedido</CardTitle>
                <Badge variant={estadoVariant[pedido.estado]}>
                  {ESTADO_PEDIDO_LABELS[pedido.estado as keyof typeof ESTADO_PEDIDO_LABELS]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex gap-4 pt-0">
              {pedido.producto.fotosUrls[0] && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={pedido.producto.fotosUrls[0]} alt={pedido.producto.titulo} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="font-medium text-sm">{pedido.producto.titulo}</p>
                <p className="text-sm text-muted-foreground">Vendedor: {pedido.vendedor.nombreMarca ?? pedido.vendedor.username}</p>
                <p className="font-bold text-primary mt-1">{formatPrice(pedido.producto.precio)}</p>
              </div>
            </CardContent>
          </Card>

          {pedido.estado === "pendiente" && (
            <QRDisplay
              qrDataUrl={qrDataUrl}
              codigoQrHash={pedido.codigoQrHash}
              vendedorWhatsapp={pedido.vendedor.whatsapp}
              productoTitulo={pedido.producto.titulo}
            />
          )}

          {pedido.estado === "entregado" && (
            <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-xl border border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-300 font-semibold text-lg">✅ Entrega confirmada</p>
              <p className="text-green-600 dark:text-green-400 text-sm mt-1">Este pedido fue entregado exitosamente</p>
            </div>
          )}

          {pedido.estado === "cancelado" && (
            <div className="text-center p-6 bg-red-50 dark:bg-red-950 rounded-xl border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-300 font-semibold text-lg">❌ Pedido cancelado</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

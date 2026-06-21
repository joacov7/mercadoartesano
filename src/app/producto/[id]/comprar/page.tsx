import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { generateQRDataURL, buildPedidoUrl } from "@/lib/qr";
import { QRDisplay } from "@/components/shared/qr-display";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ComprarPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/producto/${id}/comprar`);
  }

  const userId = (session.user as any).id;

  const producto = await prisma.producto.findUnique({
    where: { id, activo: true },
    include: {
      usuario: {
        select: { id: true, username: true, nombreMarca: true, whatsapp: true },
      },
    },
  });

  if (!producto) notFound();
  if (producto.stockEstado === "sin_stock") {
    redirect(`/producto/${id}`);
  }
  if (producto.usuarioId === userId) {
    redirect(`/producto/${id}`);
  }

  // Check if already has a pending order for this product
  const existingPedido = await prisma.pedido.findFirst({
    where: { compradorId: userId, productoId: id, estado: "pendiente" },
  });

  let pedido = existingPedido;

  if (!pedido) {
    const codigoQrHash = nanoid(12);
    pedido = await prisma.pedido.create({
      data: {
        compradorId: userId,
        vendedorId: producto.usuarioId,
        productoId: id,
        codigoQrHash,
      },
    });
  }

  const pedidoUrl = buildPedidoUrl(pedido.codigoQrHash);
  const qrDataUrl = await generateQRDataURL(pedidoUrl);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Success header */}
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">¡Pedido creado!</h1>
            <p className="text-muted-foreground text-sm">
              Guardá este QR y mostráselo al artesano cuando retires tu producto
            </p>
          </div>

          {/* Product summary */}
          <Card>
            <CardContent className="flex gap-4 p-4">
              {producto.fotosUrls[0] && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={producto.fotosUrls[0]} alt={producto.titulo} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{producto.titulo}</p>
                <p className="text-sm text-muted-foreground">
                  Vendedor: {producto.usuario.nombreMarca ?? producto.usuario.username}
                </p>
                <p className="text-lg font-bold text-primary mt-1">{formatPrice(producto.precio)}</p>
              </div>
            </CardContent>
          </Card>

          {/* QR Display */}
          <QRDisplay
            qrDataUrl={qrDataUrl}
            codigoQrHash={pedido.codigoQrHash}
            vendedorWhatsapp={producto.usuario.whatsapp}
            productoTitulo={producto.titulo}
          />

          <div className="flex gap-3">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">Seguir explorando</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/dashboard/pedidos">Mis pedidos</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

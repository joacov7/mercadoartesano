import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { MapPin, Star, BadgeCheck, ShoppingBag, Eye } from "lucide-react";
import { formatPrice, getInitials, buildWhatsAppUrl } from "@/lib/utils";
import { CATEGORIA_LABELS, TIPO_VENTA_LABELS, STOCK_ESTADO_LABELS } from "@/types";
import { ProductGallery } from "./product-gallery";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const producto = await prisma.producto.findUnique({ where: { id }, include: { usuario: true } });
  if (!producto) return { title: "Producto no encontrado" };
  return {
    title: producto.titulo,
    description: producto.descripcion ?? `${producto.titulo} - MercadoArtesano`,
    openGraph: { images: producto.fotosUrls.slice(0, 1) },
  };
}

export default async function ProductoPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const producto = await prisma.producto.findUnique({
    where: { id, activo: true },
    include: {
      usuario: {
        select: { id: true, username: true, nombreMarca: true, logoUrl: true, provincia: true, localidad: true, whatsapp: true, verificado: true, reputacionVotosPositivos: true, entregasConfirmadas: true },
      },
      _count: { select: { favoritos: true } },
    },
  });

  if (!producto) notFound();

  // Track view
  try {
    await prisma.producto.update({ where: { id }, data: { vistas: { increment: 1 } } });
  } catch {}

  let isFavorito = false;
  if (session?.user) {
    const fav = await prisma.favorito.findUnique({
      where: { usuarioId_productoId: { usuarioId: (session.user as any).id, productoId: id } },
    });
    isFavorito = !!fav;
  }

  const stockColor = { disponible: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", por_encargo: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", sin_stock: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" }[producto.stockEstado];

  const waConsultMessage = `Hola! Vi tu producto "${producto.titulo}" en MercadoArtesano y me interesa saber más. ¿Podés darme más info?`;
  const waComprarMessage = `Hola! Quiero comprar "${producto.titulo}" que vi en MercadoArtesano. ¿Está disponible?`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <ProductGallery images={producto.fotosUrls} title={producto.titulo} />

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h1 className="text-2xl font-bold leading-tight">{producto.titulo}</h1>
                <FavoriteButton
                  productoId={producto.id}
                  initialIsFavorito={isFavorito}
                  count={producto._count.favoritos}
                  showCount
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>{CATEGORIA_LABELS[producto.categoria]}</Badge>
                <Badge variant="secondary">{TIPO_VENTA_LABELS[producto.tipoVenta]}</Badge>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockColor}`}>
                  {STOCK_ESTADO_LABELS[producto.stockEstado]}
                </span>
                {producto.destacado && (
                  <Badge className="bg-mate-gold text-white border-0">
                    <Star className="h-3 w-3 mr-1 fill-current" /> Destacado
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Eye className="h-4 w-4" />
                <span>{producto.vistas} vistas</span>
              </div>

              <p className="text-3xl font-bold text-primary mb-2">{formatPrice(producto.precio)}</p>
            </div>

            {producto.descripcion && (
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{producto.descripcion}</p>
              </div>
            )}

            {/* Artisan */}
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold mb-3">Artesano</h3>
              <Link href={`/tienda/${producto.usuario.username}`} className="flex items-center gap-3 group">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={producto.usuario.logoUrl ?? ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(producto.usuario.nombreMarca ?? producto.usuario.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-medium group-hover:text-primary transition-colors truncate">
                      {producto.usuario.nombreMarca ?? `@${producto.usuario.username}`}
                    </p>
                    {producto.usuario.verificado && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
                  </div>
                  {producto.usuario.provincia && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {producto.usuario.provincia}
                    </p>
                  )}
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-mate-gold text-mate-gold" />
                      {producto.usuario.reputacionVotosPositivos} votos
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {producto.usuario.entregasConfirmadas} entregas
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Buy buttons */}
            <div className="space-y-3">
              {session?.user ? (
                <Button className="w-full gap-2" size="lg" asChild>
                  <Link href={`/producto/${producto.id}/comprar`}>
                    <ShoppingBag className="h-4 w-4" />
                    Comprar ahora
                  </Link>
                </Button>
              ) : (
                <Button className="w-full gap-2" size="lg" asChild>
                  <Link href={`/login?callbackUrl=/producto/${producto.id}/comprar`}>
                    <ShoppingBag className="h-4 w-4" />
                    Iniciar sesión para comprar
                  </Link>
                </Button>
              )}

              {producto.usuario.whatsapp && (
                <WhatsAppButton
                  phone={producto.usuario.whatsapp}
                  message={waConsultMessage}
                  label="Consultar por WhatsApp"
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

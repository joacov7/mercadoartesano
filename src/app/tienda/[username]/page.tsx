import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { StoreHeader } from "@/components/tienda/store-header";
import { StoreGrid } from "@/components/tienda/store-grid";
import type { ProductoConUsuario, UsuarioPublico } from "@/types";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const usuario = await prisma.usuario.findUnique({ where: { username } });
  if (!usuario) return { title: "Tienda no encontrada" };
  return {
    title: `${usuario.nombreMarca ?? usuario.username} - Tienda`,
    description: usuario.biografia ?? `Tienda de ${usuario.nombreMarca ?? usuario.username} en MercadoArtesano`,
    openGraph: {
      title: usuario.nombreMarca ?? usuario.username,
      description: usuario.biografia ?? "",
      images: usuario.logoUrl ? [usuario.logoUrl] : [],
    },
  };
}

export default async function TiendaPage({ params }: PageProps) {
  const { username } = await params;
  const session = await auth();

  const usuario = await prisma.usuario.findUnique({
    where: { username, activo: true },
    include: {
      _count: {
        select: { productos: { where: { activo: true } }, seguidores: true, siguiendo: true },
      },
    },
  });

  if (!usuario) notFound();

  const productos = await prisma.producto.findMany({
    where: { usuarioId: usuario.id, activo: true },
    include: {
      usuario: {
        select: { id: true, username: true, nombreMarca: true, logoUrl: true, provincia: true, localidad: true, whatsapp: true, verificado: true },
      },
      _count: { select: { favoritos: true, pedidos: true } },
    },
    orderBy: [{ destacado: "desc" }, { createdAt: "desc" }],
  });

  let isFollowing = false;
  let favoritosIds: string[] = [];

  if (session?.user) {
    const userId = (session.user as any).id;
    const [seguidor, favoritos] = await Promise.all([
      prisma.seguidor.findUnique({ where: { usuarioId_artesanoId: { usuarioId: userId, artesanoId: usuario.id } } }),
      prisma.favorito.findMany({ where: { usuarioId: userId, productoId: { in: productos.map(p => p.id) } }, select: { productoId: true } }),
    ]);
    isFollowing = !!seguidor;
    favoritosIds = favoritos.map(f => f.productoId);
  }

  const artesanoPublico: UsuarioPublico = {
    id: usuario.id,
    username: usuario.username,
    nombreMarca: usuario.nombreMarca,
    logoUrl: usuario.logoUrl,
    bannerUrl: usuario.bannerUrl,
    biografia: usuario.biografia,
    whatsapp: usuario.whatsapp,
    instagram: usuario.instagram,
    provincia: usuario.provincia,
    localidad: usuario.localidad,
    rol: usuario.rol,
    reputacionVotosPositivos: usuario.reputacionVotosPositivos,
    entregasConfirmadas: usuario.entregasConfirmadas,
    verificado: usuario.verificado,
    plan: usuario.plan,
    createdAt: usuario.createdAt,
    _count: usuario._count,
  };

  const productosConUsuario = productos.map(p => ({
    ...p,
    precio: p.precio.toString(),
  })) as ProductoConUsuario[];

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader artesano={artesanoPublico} isFollowing={isFollowing} />
      <StoreGrid productos={productosConUsuario} favoritosIds={favoritosIds} />
    </div>
  );
}

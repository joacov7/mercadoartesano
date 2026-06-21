"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleSeguidor(artesanoId: string) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado" };

  const userId = (session.user as any).id;

  if (userId === artesanoId) return { error: "No podés seguirte a vos mismo" };

  const existing = await prisma.seguidor.findUnique({
    where: { usuarioId_artesanoId: { usuarioId: userId, artesanoId } },
  });

  if (existing) {
    await prisma.seguidor.delete({
      where: { usuarioId_artesanoId: { usuarioId: userId, artesanoId } },
    });
    const artesano = await prisma.usuario.findUnique({ where: { id: artesanoId }, select: { username: true } });
    if (artesano) revalidatePath(`/tienda/${artesano.username}`);
    return { success: true, isFollowing: false };
  } else {
    await prisma.seguidor.create({
      data: { usuarioId: userId, artesanoId },
    });
    const artesano = await prisma.usuario.findUnique({ where: { id: artesanoId }, select: { username: true } });
    if (artesano) revalidatePath(`/tienda/${artesano.username}`);
    return { success: true, isFollowing: true };
  }
}

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleFavorito(productoId: string) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado" };

  const userId = (session.user as any).id;

  const existing = await prisma.favorito.findUnique({
    where: { usuarioId_productoId: { usuarioId: userId, productoId } },
  });

  if (existing) {
    await prisma.favorito.delete({
      where: { usuarioId_productoId: { usuarioId: userId, productoId } },
    });
    revalidatePath(`/producto/${productoId}`);
    return { success: true, isFavorito: false };
  } else {
    await prisma.favorito.create({
      data: { usuarioId: userId, productoId },
    });
    revalidatePath(`/producto/${productoId}`);
    return { success: true, isFavorito: true };
  }
}

export async function getFavoritos() {
  const session = await auth();
  if (!session?.user) return { favoritos: [] };

  const userId = (session.user as any).id;

  const favoritos = await prisma.favorito.findMany({
    where: { usuarioId: userId },
    include: {
      producto: {
        include: {
          usuario: {
            select: {
              id: true,
              username: true,
              nombreMarca: true,
              logoUrl: true,
              provincia: true,
              localidad: true,
              whatsapp: true,
              verificado: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { favoritos };
}

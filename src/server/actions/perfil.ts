"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const perfilSchema = z.object({
  nombreMarca: z.string().max(80).optional(),
  biografia: z.string().max(500).optional(),
  whatsapp: z.string().max(20).optional(),
  instagram: z.string().max(50).optional(),
  provincia: z.string().max(50).optional(),
  localidad: z.string().max(80).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
});

export async function actualizarPerfil(data: z.infer<typeof perfilSchema>) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado" };

  const parsed = perfilSchema.safeParse(data);
  if (!parsed.success) return { error: "Datos inválidos" };

  const userId = (session.user as any).id;

  await prisma.usuario.update({
    where: { id: userId },
    data: {
      nombreMarca: parsed.data.nombreMarca || null,
      biografia: parsed.data.biografia || null,
      whatsapp: parsed.data.whatsapp || null,
      instagram: parsed.data.instagram || null,
      provincia: parsed.data.provincia || null,
      localidad: parsed.data.localidad || null,
      ...(parsed.data.logoUrl !== undefined && { logoUrl: parsed.data.logoUrl || null }),
      ...(parsed.data.bannerUrl !== undefined && { bannerUrl: parsed.data.bannerUrl || null }),
    },
  });

  return { success: true };
}

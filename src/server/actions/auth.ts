"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";

export async function registerUser(formData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: "artesano" | "proveedor" | "cliente";
  nombreMarca?: string;
}) {
  const parsed = registerSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { username, email, password, rol, nombreMarca } = parsed.data;

  const existing = await prisma.usuario.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    if (existing.email === email) {
      return { error: { email: ["El email ya está registrado"] } };
    }
    return { error: { username: ["El usuario ya está en uso"] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const usuario = await prisma.usuario.create({
    data: { username, email, passwordHash, rol, nombreMarca: nombreMarca || null },
    select: { id: true, username: true, email: true, rol: true },
  });

  return { success: true, usuario };
}

export async function updateProfile(userId: string, data: {
  nombreMarca?: string;
  biografia?: string;
  whatsapp?: string;
  instagram?: string;
  provincia?: string;
  localidad?: string;
}) {
  const usuario = await prisma.usuario.update({
    where: { id: userId },
    data,
    select: { id: true, username: true, nombreMarca: true, biografia: true },
  });
  revalidatePath("/dashboard");
  return { success: true, usuario };
}

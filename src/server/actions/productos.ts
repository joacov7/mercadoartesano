"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productoSchema, updateProductoSchema } from "@/lib/validations/producto";
import { revalidatePath } from "next/cache";

export async function createProducto(data: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado" };

  const userId = (session.user as any).id;
  const parsed = productoSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const producto = await prisma.producto.create({
    data: { ...parsed.data, usuarioId: userId },
  });

  revalidatePath("/dashboard/productos");
  revalidatePath("/");

  return { success: true, producto: { ...producto, precio: producto.precio.toString() } };
}

export async function updateProducto(id: string, data: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado" };

  const userId = (session.user as any).id;
  const userRol = (session.user as any).rol;

  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto) return { error: "Producto no encontrado" };
  if (producto.usuarioId !== userId && userRol !== "admin") return { error: "Sin permiso" };

  const parsed = updateProductoSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const updated = await prisma.producto.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/dashboard/productos");
  revalidatePath(`/producto/${id}`);

  return { success: true, producto: { ...updated, precio: updated.precio.toString() } };
}

export async function deleteProducto(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado" };

  const userId = (session.user as any).id;
  const userRol = (session.user as any).rol;

  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto) return { error: "Producto no encontrado" };
  if (producto.usuarioId !== userId && userRol !== "admin") return { error: "Sin permiso" };

  await prisma.producto.update({ where: { id }, data: { activo: false } });

  revalidatePath("/dashboard/productos");
  revalidatePath("/");

  return { success: true };
}

export async function toggleDestacado(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado" };

  const userId = (session.user as any).id;
  const userRol = (session.user as any).rol;

  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto) return { error: "Producto no encontrado" };
  if (producto.usuarioId !== userId && userRol !== "admin") return { error: "Sin permiso" };

  const updated = await prisma.producto.update({
    where: { id },
    data: { destacado: !producto.destacado },
  });

  revalidatePath("/dashboard/productos");

  return { success: true, destacado: updated.destacado };
}

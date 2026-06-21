import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  rol: z.enum(["artesano", "proveedor", "cliente"]).default("cliente"),
  nombreMarca: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { username, email, password, rol, nombreMarca } = parsed.data;

    const existingUser = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });
      }
      return NextResponse.json({ error: "El nombre de usuario ya está en uso" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const usuario = await prisma.usuario.create({
      data: {
        username,
        email,
        passwordHash,
        rol,
        nombreMarca: nombreMarca || null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        rol: true,
        nombreMarca: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: usuario }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

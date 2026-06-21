import { z } from "zod";

export const productoSchema = z.object({
  titulo: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede tener más de 100 caracteres"),
  descripcion: z
    .string()
    .max(1000, "La descripción no puede tener más de 1000 caracteres")
    .optional(),
  precio: z
    .number()
    .positive("El precio debe ser positivo")
    .max(9999999, "El precio es muy alto"),
  categoria: z.enum([
    "mates_imperiales",
    "camioneros",
    "torpedos",
    "calabazas",
    "virolas",
    "bombillas",
    "cueros",
    "herramientas",
    "accesorios",
  ]),
  tipoVenta: z.enum(["mayorista", "minorista", "ambos"]).default("minorista"),
  stockEstado: z
    .enum(["disponible", "por_encargo", "sin_stock"])
    .default("disponible"),
  fotosUrls: z
    .array(z.string().url("URL de imagen inválida"))
    .min(1, "Debes subir al menos una foto")
    .max(8, "Máximo 8 fotos por producto"),
  destacado: z.boolean().default(false),
});

export const updateProductoSchema = productoSchema.partial();

export type ProductoFormValues = z.infer<typeof productoSchema>;
export type UpdateProductoFormValues = z.infer<typeof updateProductoSchema>;

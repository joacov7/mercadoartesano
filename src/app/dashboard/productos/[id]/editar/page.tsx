import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/productos/product-form"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Editar producto" }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarProductoPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const userId = (session.user as any).id
  const userRol = (session.user as any).rol

  const producto = await prisma.producto.findUnique({
    where: { id },
    select: {
      id: true,
      titulo: true,
      descripcion: true,
      precio: true,
      categoria: true,
      tipoVenta: true,
      stockEstado: true,
      fotosUrls: true,
      destacado: true,
      usuarioId: true,
    },
  })

  if (!producto) notFound()
  if (producto.usuarioId !== userId && userRol !== "admin") redirect("/dashboard/productos")

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar producto</h1>
        <p className="text-muted-foreground text-sm">Modificá los datos de tu producto</p>
      </div>
      <ProductForm
        mode="edit"
        initialData={{
          id: producto.id,
          titulo: producto.titulo,
          descripcion: producto.descripcion ?? "",
          precio: producto.precio.toString(),
          categoria: producto.categoria,
          tipoVenta: producto.tipoVenta,
          stockEstado: producto.stockEstado,
          fotosUrls: producto.fotosUrls,
          destacado: producto.destacado,
        }}
      />
    </div>
  )
}

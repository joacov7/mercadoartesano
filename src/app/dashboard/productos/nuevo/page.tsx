import { Metadata } from "next";
import { ProductForm } from "@/components/productos/product-form";

export const metadata: Metadata = { title: "Nuevo producto" };

export default function NuevoProductoPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Publicar nuevo producto</h1>
        <p className="text-muted-foreground text-sm">Completá los datos de tu mate artesanal</p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}

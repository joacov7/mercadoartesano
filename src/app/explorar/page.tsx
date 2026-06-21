import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ExplorarClient } from "./explorar-client";
import { ProductGridSkeleton } from "@/components/productos/product-skeleton";

export const metadata: Metadata = {
  title: "Explorar productos",
  description: "Explorar todos los mates artesanales y productos de artesanos argentinos",
};

export default function ExplorarPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">Explorar productos</h1>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ExplorarClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HomeSwitchTab } from "@/components/home/home-switch";
import { SearchBar } from "@/components/home/search-bar";
import { FiltersBar } from "@/components/home/filters-bar";
import { HomeProductsSection } from "@/components/home/home-products-section";
import { ProductGridSkeleton } from "@/components/productos/product-skeleton";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        {/* Hero text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            🧉 MercadoArtesano
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            Descubrí los mejores mates artesanales de Argentina. Conectamos artesanos con amantes del mate.
          </p>
        </div>

        <SearchBar />
        <HomeSwitchTab />
        <FiltersBar />

        <Suspense fallback={<ProductGridSkeleton />}>
          <HomeProductsSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

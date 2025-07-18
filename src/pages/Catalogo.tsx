import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

const Catalogo = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState("popularidad");

  const products = [
    {
      id: 1,
      name: "Blusa Elegante Manga Larga Premium",
      price: 25990,
      imageUrl: "/placeholder.svg",
      category: "Blusas",
      discount: 30,
      rating: 4.8,
      reviews: 156
    },
    {
      id: 2,
      name: "Pantalón de Vestir Corte Italiano",
      price: 32990,
      imageUrl: "/placeholder.svg",
      category: "Pantalones",
      discount: 20,
      rating: 4.5,
      reviews: 89
    },
    {
      id: 3,
      name: "Zapatos Oxford de Cuero Genuino",
      price: 45990,
      imageUrl: "/placeholder.svg",
      category: "Calzado",
      discount: 15,
      rating: 4.2,
      reviews: 45
    },
    {
      id: 4,
      name: "Cartera de Cuero Premium con Diseño Exclusivo",
      price: 59990,
      imageUrl: "/placeholder.svg",
      category: "Accesorios",
      discount: 25,
      rating: 4.9,
      reviews: 210
    },
    {
      id: 5,
      name: "Vestido de Noche Lentejuelas",
      price: 25990,
      imageUrl: "/placeholder.svg",
      category: "Vestidos",
      discount: 30,
      rating: 4.8,
      reviews: 156
    },
    {
      id: 6,
      name: "Camisa Casual de Algodón Orgánico",
      price: 32990,
      imageUrl: "/placeholder.svg",
      category: "Camisas",
      discount: 20,
      rating: 4.5,
      reviews: 89
    },
    {
      id: 7,
      name: "Botas de Invierno Impermeables",
      price: 45990,
      imageUrl: "/placeholder.svg",
      category: "Calzado",
      discount: 15,
      rating: 4.2,
      reviews: 45
    },
    {
      id: 8,
      name: "Reloj de Acero Inoxidable con Cronógrafo",
      price: 59990,
      imageUrl: "/placeholder.svg",
      category: "Accesorios",
      discount: 25,
      rating: 4.9,
      reviews: 210
    },
    {
      id: 9,
      name: "Falda Midi Plisada Estampada",
      price: 25990,
      imageUrl: "/placeholder.svg",
      category: "Faldas",
      discount: 30,
      rating: 4.8,
      reviews: 156
    },
    {
      id: 10,
      name: "Chaqueta de Cuero Ecológico",
      price: 32990,
      imageUrl: "/placeholder.svg",
      category: "Chaquetas",
      discount: 20,
      rating: 4.5,
      reviews: 89
    },
    {
      id: 11,
      name: "Sandalias de Verano con Plataforma",
      price: 45990,
      imageUrl: "/placeholder.svg",
      category: "Calzado",
      discount: 15,
      rating: 4.2,
      reviews: 45
    },
    {
      id: 12,
      name: "Gafas de Sol Polarizadas",
      price: 59990,
      imageUrl: "/placeholder.svg",
      category: "Accesorios",
      discount: 25,
      rating: 4.9,
      reviews: 210
    }
  ];

  const filteredProducts = products.filter((product) => {
    const searchLower = search.toLowerCase();
    const nameLower = product.name.toLowerCase();
    return nameLower.includes(searchLower) && (category === "Todas" || product.category === category);
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "precio") {
      return a.price - b.price;
    }
    return 0;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 bg-gray-50 pb-20">
          <Header />

          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-estancias-charcoal">
                Catálogo de Productos
              </h1>
              <Badge variant="secondary">
                {products.length} Productos
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-4 w-full md:w-auto">
                <Button variant="secondary" className="space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Categorías</span>
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                El catálogo de productos ha sido movido a nuestro sitio web principal.
              </p>
              <Button 
                onClick={() => window.open('https://estanciaschiripa.com.ar/', '_blank')}
                className="mt-4"
              >
                Ver Catálogo Completo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Catalogo;

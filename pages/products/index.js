import { useRouter } from "next/router";
import ProductGrid from "../../components/products/ProductGrid";
import Link from "next/link";
import FilterBar from "../../components/products/FilterBar";
import { supabase } from "../../utils/supabase";

const pills = [
  { key: "", label: "Todos" },
  { key: "pro", label: "Pro" },
  { key: "plus", label: "Plus" },
  { key: "nuevo", label: "Nuevo" },
];

export async function getStaticProps() {
  const { data: dbProducts } = await supabase
    .from('products')
    .select('id, title, price_usd, price_ars, preferred_currency, has_variants, image_urls, slug, stock, categories!inner(name), product_variants(price_usd, price_ars, preferred_currency, stock)')
    .eq('store', 'fantech')
    .eq('is_active', true);

  const mappedProducts = (dbProducts || []).map(p => {
    return {
      id: p.id,
      name: p.title,
      slug: p.slug,
      category: p.categories?.name || '',
      price: p.price_usd,
      price_usd: p.price_usd,
      price_ars: p.price_ars,
      preferred_currency: p.preferred_currency || 'usd',
      has_variants: p.has_variants,
      variants: p.product_variants || [],
      stock: p.stock,
      image: p.image_urls?.[0] || '',
      shortDescription: 'Rendimiento y diseño premium.',
      specs: []
    };
  });

  return { props: { products: mappedProducts }, revalidate: 60 };
}

export default function ProductsPage({ products }) {
  const router = useRouter();
  const category = (router.query.category || "").toString().toLowerCase();

  // Categoría en DB es "Macs & iPads", pero el query dice "macs & ipads". O "macs%20%26%20ipads". 
  // products.json tenía "Macs & iPads". En categories DB, name es "Macs & iPads".
  const filteredBase = category ? products.filter(p => p.category.toLowerCase() === category) : products;

  const [filters, setFilters] = require("react").useState({ search: "", minPrice: "", maxPrice: "", sort: "relevance", tags: [] });
  const [showMobileFilters, setShowMobileFilters] = require("react").useState(false);
  const pill = (router.query.filter || "").toString().toLowerCase();

  let filtered = filteredBase.filter(p => {
    // Aplicar filtros solo en categoría iPhone
    if (category !== "iphone") return true;
    if (!pill) return true;
    if (pill === "pro") return /pro/i.test(p.name);
    if (pill === "plus") return /plus/i.test(p.name);
    if (pill === "nuevo") return /17|16/.test(p.name);
    return true;
  });

  // Aplicar filtros inteligentes comunes
  filtered = filtered.filter(p => {
    const matchesSearch = filters.search ? (p.name.toLowerCase().includes(filters.search.toLowerCase()) || (p.shortDescription || "").toLowerCase().includes(filters.search.toLowerCase())) : true;
    const priceOk = (
      (filters.minPrice ? p.price >= Number(filters.minPrice) : true) &&
      (filters.maxPrice ? p.price <= Number(filters.maxPrice) : true)
    );
    const tagsOk = filters.tags.length > 0 ? filters.tags.some(t => new RegExp(t, "i").test(p.name)) : true;
    return matchesSearch && priceOk && tagsOk;
  });

  // Ordenamiento
  filtered = [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      case "new": return (b.id || 0) - (a.id || 0); // Assuming ID is roughly ordered, or just keep as is
      default: return 0;
    }
  });

  const isIphone = category === "iphone";
  const isMacs = category === "macs & ipads" || category === "macs%20%26%20ipads";
  const isAcc = category === "accesorios";

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-navy border-b border-navy/20 pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white capitalize">
            {category === "macs & ipads" || category === "macs%20%26%20ipads" ? "Macs & iPads" : (category ? category : "Todos los Productos")}
          </h1>
          <p className="mt-4 text-white/80 font-medium max-w-xl mx-auto text-sm md:text-base">
            Explorá nuestra selección premium. Elegí el equipo perfecto para vos.
          </p>
        </div>
      </section>

      {/* Main Container - Split Layout */}
      <section className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full flex justify-end mb-4">
          <button onClick={() => setShowMobileFilters(true)} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-navy font-bold shadow-sm">
            Filtros
          </button>
        </div>

        {/* Backdrop & Mobile Sidebar */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
            <div className="relative bg-white w-4/5 max-w-sm h-full p-6 overflow-y-auto z-10 shadow-2xl transition-transform simple-scrollbar">
              <button onClick={() => setShowMobileFilters(false)} className="absolute top-4 right-4 text-navy/60 hover:text-navy font-bold text-2xl px-2">✕</button>
              <h3 className="font-extrabold text-navy text-2xl mb-6">Filtros</h3>
              <FilterBar category={category} onChange={setFilters} />
            </div>
          </div>
        )}

        {/* Desktop Sidebar (Filters) */}
        <div className="hidden lg:block lg:w-72 flex-shrink-0 sticky top-28 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 simple-scrollbar">
          <FilterBar category={category} onChange={setFilters} />
        </div>

        {/* Product Grid */}
        <div className="flex-1 w-full relative">
          {isIphone && (
            <div className="mb-6 flex flex-wrap gap-3">
              {pills.map(p => {
                const active = pill === p.key;
                const href = { pathname: "/products", query: { category, filter: p.key } };
                return (
                  <Link key={p.key} href={href} className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all ${active ? 'bg-cyan text-white shadow-md' : 'bg-white border border-graylight hover:border-cyan text-navy'}`}>
                    {p.label}
                  </Link>
                );
              })}
            </div>
          )}
          <ProductGrid products={filtered} />
        </div>
      </section>
    </div>
  );
}

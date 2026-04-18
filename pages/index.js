import Link from "next/link";
import { TrendingUp, ShoppingCart, MessageCircle, ArrowRight } from "lucide-react";
import ProductGrid from "../components/products/ProductGrid";
import { supabase } from "../utils/supabase";
import { useCurrency } from "../context/CurrencyContext";
import { useEffect, useMemo, useState } from "react";

export async function getStaticProps() {
  const { data: dbProducts } = await supabase
    .from('products')
    .select('id, title, price_usd, price_ars, price_usdt, preferred_currency, has_variants, image_urls, slug, stock, categories!inner(name), product_variants(price_usd, price_ars, price_usdt, preferred_currency)')
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
      price_usdt: p.price_usdt,
      preferred_currency: p.preferred_currency || 'usd',
      has_variants: p.has_variants,
      variants: p.product_variants || [],
      stock: p.stock,
      image: p.image_urls?.[0] || '',
      shortDescription: 'Rendimiento y diseño premium.',
      specs: []
    };
  });

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('store', 'fantech')
    .eq('is_active', true)
    .order('name');

  return { props: { products: mappedProducts, categories: categories || [] }, revalidate: 60 };
}

export default function HomePage({ products = [], categories = [] }) {
  const { formatPrice, getProductPrice } = useCurrency();
  const topMetrics = products.slice(0, 3);

  const categoriesWithProducts = categories.map(c => ({
    ...c,
    previewProducts: products.filter(p => p.category === c.name).slice(0, 2)
  })).filter(c => c.previewProducts.length > 0);
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12 py-12 bg-gradient-to-br from-navy via-navy to-cyan/20 overflow-hidden text-center lg:text-left gap-12">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: "url('https://i.pinimg.com/1200x/70/37/f4/7037f423289e9142d874380eb3b7c857.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Top Metrics Irregular Grid - Left on desktop, Top on mobile */}
        <div className="z-10 w-full lg:w-1/2 order-2 lg:order-1 lg:pr-8 animate-fade-up anim-delay-200">
          {topMetrics.length >= 3 && (
            <div className="flex flex-col gap-4 max-w-sm sm:max-w-md mx-auto lg:ml-0 lg:mr-auto w-full">
              {/* Main item (top) */}
              <Link href={`/products/${topMetrics[0]?.slug}`} className="group relative rounded-3xl bg-white border border-gray-100 shadow-md hover:shadow-xl flex flex-col justify-between overflow-hidden transition-all duration-500 w-full sm:h-[350px]">
                <div className="relative w-full h-[220px] sm:h-auto sm:flex-1 flex items-center justify-center p-3 bg-gray-50/40 min-h-0">
                  {topMetrics[0]?.stock <= 0 && <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider z-10 w-max">Sin Stock</div>}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={topMetrics[0]?.image} alt={topMetrics[0]?.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                {/* Robust text container */}
                <div className="z-20 w-full p-5 bg-white border-t border-gray-50 shrink-0">
                  <h4 className="text-navy font-bold tracking-tight text-lg line-clamp-1 truncate" title={topMetrics[0]?.name}>{topMetrics[0]?.name}</h4>
                  <p className="text-cyan font-extrabold mt-1 text-xl truncate">
                    {(() => {
                      const p = topMetrics[0];
                      if (!p) return null;
                      if (p.has_variants && p.variants && p.variants.length > 0) {
                        const validVariants = p.variants.filter(v => getProductPrice(v) > 0);
                        if (validVariants.length > 0) {
                          const minVariant = validVariants.reduce((min, v) => getProductPrice(v) < getProductPrice(min) ? v : min, validVariants[0]);
                          return <><span className="text-xs text-navy/50 uppercase tracking-widest mr-1">Desde</span>{formatPrice(minVariant)}</>;
                        }
                      }
                      return formatPrice(p);
                    })()}
                  </p>
                </div>
              </Link>

              {/* Bottom 2 items */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <Link href={`/products/${topMetrics[1]?.slug}`} className="group relative rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden transition-all duration-500 h-[220px] sm:h-[240px]">
                  <div className="w-full flex items-center justify-center relative flex-1 p-2 bg-gray-50/40 min-h-0">
                    {topMetrics[1]?.stock <= 0 && <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider z-10 w-max">Sin Stock</div>}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={topMetrics[1]?.image} alt={topMetrics[1]?.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="w-full p-3 sm:p-3 bg-white border-t border-gray-50 z-20 shrink-0">
                    <h4 className="text-navy font-bold tracking-tight text-[13px] sm:text-sm line-clamp-1 truncate" title={topMetrics[1]?.name}>{topMetrics[1]?.name}</h4>
                    <p className="text-cyan font-bold mt-1 text-sm sm:text-base truncate">
                      {(() => {
                        const p = topMetrics[1];
                        if (!p) return null;
                        if (p.has_variants && p.variants && p.variants.length > 0) {
                          const validVariants = p.variants.filter(v => getProductPrice(v) > 0);
                          if (validVariants.length > 0) {
                            const minVariant = validVariants.reduce((min, v) => getProductPrice(v) < getProductPrice(min) ? v : min, validVariants[0]);
                            return <><span className="text-[10px] text-navy/50 uppercase tracking-widest mr-1">Desde</span>{formatPrice(minVariant)}</>;
                          }
                        }
                        return formatPrice(p);
                      })()}
                    </p>
                  </div>
                </Link>

                <Link href={`/products/${topMetrics[2]?.slug}`} className="group relative rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden transition-all duration-500 h-[220px] sm:h-[240px]">
                  <div className="w-full flex items-center justify-center relative flex-1 p-2 bg-gray-50/40 min-h-0">
                    {topMetrics[2]?.stock <= 0 && <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider z-10 w-max">Sin Stock</div>}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={topMetrics[2]?.image} alt={topMetrics[2]?.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="w-full p-3 sm:p-3 bg-white border-t border-gray-50 z-20 shrink-0">
                    <h4 className="text-navy font-bold tracking-tight text-[13px] sm:text-sm line-clamp-1 truncate" title={topMetrics[2]?.name}>{topMetrics[2]?.name}</h4>
                    <p className="text-cyan font-bold mt-1 text-sm sm:text-base truncate">
                      {(() => {
                        const p = topMetrics[2];
                        if (!p) return null;
                        if (p.has_variants && p.variants && p.variants.length > 0) {
                          const validVariants = p.variants.filter(v => getProductPrice(v) > 0);
                          if (validVariants.length > 0) {
                            const minVariant = validVariants.reduce((min, v) => getProductPrice(v) < getProductPrice(min) ? v : min, validVariants[0]);
                            return <><span className="text-[10px] text-navy/50 uppercase tracking-widest mr-1">Desde</span>{formatPrice(minVariant)}</>;
                          }
                        }
                        return formatPrice(p);
                      })()}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Texts - Right on desktop, Bottom on mobile */}
        <div className="z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-start lg:pl-12 order-1 lg:order-2 mb-8 lg:mb-0">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-[1] animate-fade-up">
            Tecnología premium,<br className="hidden sm:block" />
            sin concesiones.
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed animate-fade-up anim-delay-200">
            Diseño. Potencia. Confiabilidad. Tecnología de última generación.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 animate-fade-up anim-delay-300 w-full">
            <Link href="/products" className="bg-cyan w-full sm:w-auto text-center hover:bg-cyan/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan/30 transition-all hover:-translate-y-1">
              Explorar productos
            </Link>
            <Link href="/products?category=iphone" className="bg-transparent w-full sm:w-auto text-center hover:bg-white/10 border border-white/50 text-white px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-sm transition-all hover:-translate-y-1">
              Ver iPhone
            </Link>
          </div>
        </div>
      </section>

      {/* Categorized Products (Like Vaplux) */}
      <section className="bg-gray-50 border-t border-gray-200 px-6 lg:px-12 py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight">Explorá por Categoría</h2>
              <p className="text-navy/70 text-base mt-2 font-medium">Sumergite en nuestra selección premium. Calidad y rendimiento en cada equipo.</p>
            </div>
            <Link href="/products" className="group mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-cyan font-bold hover:text-navy transition">
              Ver Catálogo Completo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            {categoriesWithProducts.map(c => (
              <div key={c.slug} className="flex flex-col mb-8 lg:mb-0">
                {/* Mobile Header (Hidden on Desktop) */}
                <div className="flex lg:hidden items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-navy truncate pr-2">{c.name}</h3>
                  <Link href={`/products?category=${encodeURIComponent(c.name.toLowerCase())}`} className="text-cyan text-sm font-bold whitespace-nowrap hover:underline">
                    Ver más &rarr;
                  </Link>
                </div>

                {/* Desktop Category Card (Hidden on Mobile) */}
                <Link href={`/products?category=${encodeURIComponent(c.name.toLowerCase())}`} className="hidden lg:flex bg-navy rounded-2xl p-6 text-white h-40 flex-col justify-end group overflow-hidden relative border border-navy/20 shadow-md hover:shadow-lg transition-all mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-cyan/20 group-hover:scale-105 transition-transform duration-700" />
                  <h3 className="text-2xl font-bold relative z-10 tracking-tight leading-tight">{c.name}</h3>
                  <span className="text-cyan text-sm font-bold flex items-center gap-1 mt-2 relative z-10 group-hover:translate-x-1 transition-transform">Ver todo <ArrowRight size={14} /></span>
                </Link>

                {/* Products Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                  {c.previewProducts.map(p => (
                    <Link key={p.id} href={`/products/${p.slug}`} className="group bg-white border border-gray-200 rounded-xl p-4 transition-all hover:shadow-md flex flex-col lg:flex-row lg:items-center gap-4 h-full relative">
                      {p.stock <= 0 && <div className="absolute top-2 left-2 lg:top-4 lg:left-4 z-10 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-wider w-max">Sin Stock</div>}
                      <div className="w-full lg:w-24 lg:h-24 aspect-square lg:aspect-auto flex items-center justify-center p-2 bg-gray-50 rounded-lg flex-shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="mt-auto lg:mt-0 flex flex-col justify-center flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-cyan tracking-wider uppercase mb-0.5 truncate block">{p.category}</span>
                        <h4 className="text-navy font-bold text-sm mb-1 line-clamp-2 lg:line-clamp-1 leading-tight break-words">{p.name}</h4>
                        <p className="text-navy font-extrabold text-sm lg:text-base truncate">
                          {(() => {
                            if (p.has_variants && p.variants && p.variants.length > 0) {
                              const validVariants = p.variants.filter(v => getProductPrice(v) > 0);
                              if (validVariants.length > 0) {
                                const minVariant = validVariants.reduce((min, v) => getProductPrice(v) < getProductPrice(min) ? v : min, validVariants[0]);
                                return <><span className="text-[10px] text-navy/50 uppercase tracking-widest mr-1">Desde</span>{formatPrice(minVariant)}</>;
                              }
                            }
                            return formatPrice(p);
                          })()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

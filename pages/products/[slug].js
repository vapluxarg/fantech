import Link from "next/link";
import { supabase } from "../../utils/supabase";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useEffect, useState } from "react";
import RelatedCarousel from "../../components/products/RelatedCarousel";

export async function getStaticPaths() {
  const { data: dbProducts } = await supabase
    .from('products')
    .select('slug')
    .eq('store', 'fantech')
    .eq('is_active', true);

  const paths = (dbProducts || []).map(p => ({
    params: { slug: p.slug }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const { data: dbProduct } = await supabase
    .from('products')
    .select('id, title, description, price_usd, price_ars, price_usdt, preferred_currency, has_variants, image_urls, slug, stock, categories!inner(name)')
    .eq('store', 'fantech')
    .eq('slug', params.slug)
    .single();

  if (!dbProduct) {
    return { notFound: true };
  }

  const product = {
    id: dbProduct.id,
    name: dbProduct.title,
    slug: dbProduct.slug,
    category: dbProduct.categories?.name || '',
    price: dbProduct.price_usd,
    price_usd: dbProduct.price_usd,
    price_ars: dbProduct.price_ars,
    price_usdt: dbProduct.price_usdt,
    preferred_currency: dbProduct.preferred_currency || 'usd',
    has_variants: dbProduct.has_variants,
    stock: dbProduct.stock,
    image: dbProduct.image_urls?.[0] || '',
    images: dbProduct.image_urls || [],
    description: dbProduct.description || '',
    specs: dbProduct.description ? dbProduct.description.split('\n').map(s => s.trim()).filter(Boolean) : []
  };

  const { data: dbRelated } = await supabase
    .from('products')
    .select('id, title, price_usd, price_ars, price_usdt, preferred_currency, image_urls, slug, stock, categories!inner(name)')
    .eq('store', 'fantech')
    .eq('categories.name', product.category)
    .neq('slug', product.slug)
    .limit(4);

  const related = (dbRelated || []).map(p => ({
    id: p.id,
    name: p.title,
    slug: p.slug,
    category: p.categories?.name || '',
    price: p.price_usd,
    price_usd: p.price_usd,
    price_ars: p.price_ars,
    price_usdt: p.price_usdt,
    preferred_currency: p.preferred_currency || 'usd',
    stock: p.stock,
    image: p.image_urls?.[0] || ''
  }));

  const { data: dbVariants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', dbProduct.id)
    .eq('is_active', true)
    .order('created_at');

  return { props: { product, related, variants: dbVariants || [] }, revalidate: 60 };
}

export default function ProductDetailPage({ product, related, variants }) {
  const { addToCart } = useCart();
  const { formatPrice, getProductPrice } = useCurrency();
  const [qty, setQty] = useState(1);
  const [pop, setPop] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const selectedImage = product.images?.[selectedImageIdx] || product.image;

  // Variant Logic
  const attrKeys = Array.from(new Set(variants.flatMap(v => Object.keys(v.attributes || {}))));
  const [selectedAttrs, setSelectedAttrs] = useState({});

  useEffect(() => {
    setQty(1);
    if (variants.length > 0) {
      const cheapest = variants.reduce((min, v) => getProductPrice(v) < getProductPrice(min) ? v : min, variants[0]);
      setSelectedAttrs(cheapest.attributes || {});
    } else {
      setSelectedAttrs({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.slug]);

  const selectedVariant = variants.length > 0 
    ? variants.find(v => attrKeys.every(k => v.attributes[k] === selectedAttrs[k]))
    : null;

  const displayProduct = selectedVariant 
    ? { ...product, price_usd: selectedVariant.price_usd, price_ars: selectedVariant.price_ars, stock: selectedVariant.stock }
    : product;

  const isAddDisabled = (variants.length > 0 && !selectedVariant) || displayProduct.stock === 0;

  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Image Gallery */}
            <div className="flex flex-col-reverse lg:flex-row gap-6 lg:items-start h-full">
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="hidden lg:flex lg:flex-col gap-4 overflow-y-auto lg:max-h-[500px] simple-scrollbar pb-0">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-2xl border-2 overflow-hidden transition-all bg-white ${selectedImageIdx === idx ? 'border-cyan shadow-md scale-105' : 'border-gray-200 hover:border-cyan/50 opacity-70 hover:opacity-100'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-contain p-2" />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Main Image */}
              <div className="relative flex-1 bg-white rounded-3xl p-8 lg:p-12 aspect-square lg:aspect-auto lg:h-[500px] shadow-sm flex items-center justify-center border border-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                
                {/* Mobile Arrows/Dots */}
                {product.images.length > 1 && (
                  <>
                    <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                      <button onClick={(e) => { e.preventDefault(); setSelectedImageIdx(i => i === 0 ? product.images.length - 1 : i - 1); }} className="w-10 h-10 ml-4 rounded-full bg-white/90 border border-gray-200 text-navy font-bold flex items-center justify-center shadow-md active:scale-95 transition-transform">{'<'}</button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center lg:hidden">
                      <button onClick={(e) => { e.preventDefault(); setSelectedImageIdx(i => i === product.images.length - 1 ? 0 : i + 1); }} className="w-10 h-10 mr-4 rounded-full bg-white/90 border border-gray-200 text-navy font-bold flex items-center justify-center shadow-md active:scale-95 transition-transform">{'>'}</button>
                    </div>
                    <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 lg:hidden">
                      {product.images.map((_, idx) => (
                        <div key={idx} className={`w-2 h-2 rounded-full transition-all ${selectedImageIdx === idx ? 'bg-cyan w-4' : 'bg-gray-300'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="inline-flex bg-cyan text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-md mb-6 tracking-widest self-start">
                {product.category}
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-navy leading-[1.1] tracking-tight mb-8">
                {product.name}
              </h1>

              {/* Price & Action Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-navy/5 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan to-blue-500"></div>
                <p className="text-5xl font-extrabold text-cyan tracking-tight mb-6 mt-2">
                  {formatPrice(displayProduct)}
                </p>

                {variants.length > 0 && (
                  <div className="flex flex-col gap-5 mb-8">
                    {attrKeys.map(key => {
                      const options = Array.from(new Set(variants.map(v => v.attributes[key]))).filter(Boolean);
                      return (
                        <div key={key}>
                          <span className="block text-xs uppercase tracking-widest font-bold text-navy/60 mb-3">{key}</span>
                          <div className="flex flex-wrap gap-2">
                            {options.map(opt => {
                              const isActive = selectedAttrs[key] === opt;
                              return (
                                <button
                                  key={opt}
                                  onClick={() => setSelectedAttrs(prev => ({ ...prev, [key]: opt }))}
                                  className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                                    isActive ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-gray-200 hover:border-navy cursor-pointer'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  {/* Quantity Input */}
                  <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-2 gap-4 h-14 w-full sm:w-1/3 justify-between">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-graylight rounded-xl transition-all text-navy font-black text-lg">-</button>
                    <span className="font-bold text-lg text-navy">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(displayProduct.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-graylight rounded-xl transition-all text-navy font-black text-lg">+</button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    disabled={isAddDisabled}
                    onClick={() => { 
                      setPop(true); 
                      addToCart(product, qty, selectedVariant); 
                      setTimeout(() => setPop(false), 240); 
                    }}
                    className={`w-full sm:w-2/3 bg-cyan hover:bg-cyan/90 text-white font-black py-0 h-14 rounded-2xl shadow-lg shadow-cyan/20 transition-all ${(!isAddDisabled) ? 'hover:scale-[1.02]' : 'opacity-60 cursor-not-allowed'} ${pop ? 'animate-clickPop' : ''}`}
                  >
                    {(variants.length > 0 && !selectedVariant) ? 'Seleccioná las variantes' : displayProduct.stock === 0 ? 'Sin Stock' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Especificaciones completas */}
      {product.specs.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
              <div className="lg:w-1/3">
                <h2 className="text-3xl lg:text-4xl font-black text-navy tracking-tight leading-[1.1]">
                  Especificaciones Técnicas
                </h2>
                <p className="text-navy/60 font-medium mt-4">
                  Todo lo que necesitás saber sobre {product.name}.
                </p>
              </div>
              <div className="lg:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {product.specs.map((s, i) => (
                    <div key={i} className="py-2 border-b border-gray-100 flex items-start gap-4">
                      <span className="text-cyan font-bold mt-1">•</span>
                      <p className="text-navy/80 font-medium leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-navy tracking-tight">También te puede interesar</h2>
            </div>
            <RelatedCarousel products={related} />
          </div>
        </section>
      )}
    </div>
  );
}

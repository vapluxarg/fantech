import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { formatPrice, getProductPrice } = useCurrency();
  const [pop, setPop] = useState(false);

  let displayPrice = formatPrice(product);
  let hasPrefix = false;
  let stock = product.stock;

  if (product.has_variants && product.variants && product.variants.length > 0) {
    stock = product.variants.reduce((acc, v) => acc + Number(v.stock || 0), 0);
    const validVariants = product.variants.filter(v => getProductPrice(v) > 0);
    if (validVariants.length > 0) {
      const minVariant = validVariants.reduce((min, v) => getProductPrice(v) < getProductPrice(min) ? v : min, validVariants[0]);
      displayPrice = formatPrice(minVariant);
      hasPrefix = true;
    }
  }

  const tags = [];
  if (/pro/i.test(product.name)) tags.push("Pro");
  if (/17/.test(product.name)) tags.push("Nuevo");
  const isFeatured = ["iphone-17-pro-max", "iphone-17-pro", "macbook-pro-14-m5", "macbook-air-15-m4"].includes(product.slug);
  if (isFeatured) tags.push("Destacado");

  const handleAddCart = (e) => {
    e.preventDefault();
    setPop(true);
    addToCart(product, 1);
    setTimeout(() => setPop(false), 240);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 p-4 flex flex-col hover:shadow-blueGlow transition-all duration-300">
      {/* Container Fotografía */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-graylight/30 rounded-xl overflow-hidden mb-5 flex items-center justify-center">
        {stock <= 0 && (
          <div className="absolute top-3 left-3 bg-red-100/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-black text-red-600 uppercase tracking-widest z-10 shadow-sm">
            Sin Stock
          </div>
        )}
        {tags.length > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-black text-navy uppercase tracking-widest z-10 shadow-sm">
            {tags[0]}
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      {/* Detalles del Producto */}
      <div className="flex flex-col flex-1">
        <span className="text-[10px] text-navy/50 font-bold uppercase tracking-widest mb-1 truncate block" title={product.category}>{product.category}</span>
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-navy font-bold text-base sm:text-lg leading-tight mb-2 line-clamp-2 hover:text-cyan transition-colors" title={product.name}>
            {product.name}
          </h3>
        </Link>
        <p className="text-cyan font-black text-xl sm:text-2xl mb-4 mt-auto truncate break-words leading-tight">
          {hasPrefix ? (
            <>
              <span className="text-xs text-navy/50 tracking-widest uppercase mr-1">Desde</span>
              {displayPrice}
            </>
          ) : (
            displayPrice
          )}
        </p>

        {/* Botones */}
        <div className="flex gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 flex justify-center items-center bg-cyan hover:bg-cyan/90 text-white font-black py-3 rounded-xl text-xs sm:text-sm transition-all active:scale-95 text-center min-w-[100px]"
          >
            Ver equipo
          </Link>
          {!product.has_variants && (
            <button
              onClick={handleAddCart}
              aria-label="Agregar al carrito"
              className={`w-12 h-12 flex items-center justify-center bg-graylight hover:bg-gray-200 text-navy rounded-xl transition-all ${pop ? 'animate-clickPop' : ''}`}
            >
              <ShoppingCart size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

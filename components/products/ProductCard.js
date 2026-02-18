import Link from "next/link";
import { useRef, useState } from "react";
import { formatCurrency } from "../../utils/format";

export default function ProductCard({ product, compact = false, variant = 'standard' }) {
  const cardRef = useRef(null);
  const frameRef = useRef(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const tags = [];
  if (/pro/i.test(product.name)) tags.push("Pro");
  if (/17/.test(product.name)) tags.push("Nuevo");
  const isFeatured = ["iphone-17-pro-max", "iphone-17-pro", "ultrabook-pro-14", "pro-tablet-x"].includes(product.slug);
  if (isFeatured) tags.push("Destacado");

  const variantClass = variant === 'flagship' ? 'card-flagship' : variant === 'accessory' ? 'card-accessory' : '';

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width; // 0..1
    const ry = (e.clientY - rect.top) / rect.height; // 0..1
    const rotY = (rx - 0.5) * 12; // -6..6
    const rotX = (0.5 - ry) * 12; // -6..6
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      setTilt({ x: rotX, y: rotY });
      frameRef.current = 0;
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const tiltStyle = {
    transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: 'transform 120ms ease-out',
    willChange: 'transform',
  };

  const imgParallaxStyle = {
    transform: `translateX(${tilt.y * 0.8}px) translateY(${(-tilt.x) * 0.8}px)`,
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className={`group ${compact ? '' : 'card'} ${variantClass} relative overflow-hidden bg-white card-structure-shadow hover:card-glow-shadow card-hover stagger-hover focus-accessible`}
    > 
      {/* borde inteligente con gradiente (solo en hover) */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-gradient-hover" />
      <Link href={`/products/${product.slug}`} className="block">
        <div className={`w-full overflow-hidden ${compact ? 'rounded-t-lg aspect-[4/3]' : 'rounded-t-xl aspect-[4/3]'} image-safe-zone` }>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-contain transition-transform duration-300 delay-75 group-hover:scale-[1.03]`}
            style={imgParallaxStyle}
          />
        </div>
      </Link>
      {/* badge premium con efecto glass */}
      <div className="absolute top-3 left-3 flex gap-1">
        {tags.slice(0,2).map(t => (
          <span key={t} className="glass-badge">{t}</span>
        ))}
      </div>

      <div className={`${compact ? 'p-3' : 'p-4'} flex flex-col gap-2 transition-all duration-300 ease-out group-hover:-translate-y-1`}>
        <div className="flex items-center justify-between gap-2">
          <span className="badge bg-cyan/15 text-navy text-[11px] uppercase tracking-wide truncate max-w-[65%]">{product.category}</span>
          <span className="text-[11px] text-navy/60 whitespace-nowrap">Stock: {product.stock}</span>
        </div>
        <Link href={`/products/${product.slug}`} className="block font-medium tracking-tight text-navy hover:text-cyan">
          {product.name}
        </Link>
        <p className="text-[13px] text-navy/70 leading-snug line-clamp-2 min-h-[32px]">{product.shortDescription || "Rendimiento profesional. Diseño premium."}</p>
        <div className="flex items-end justify-between gap-2 pt-1">
          <p className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-navy`}>{formatCurrency(product.price)}</p>
          <Link
            href={`/products/${product.slug}`}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-navy text-white text-[11px] uppercase tracking-wide shrink-0 focus-accessible"
          >
            Más
            <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

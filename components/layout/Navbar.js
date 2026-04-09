import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { supabase } from "../../utils/supabase";

const baseLinks = [
  { href: "/", label: "Inicio" },
];

const endLinks = [
  { href: "/products", label: "Todos los Productos" },
];

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [animateAdd, setAnimateAdd] = useState(false);
  const prevCountRef = useRef(totalItems);
  const [catLinks, setCatLinks] = useState([]);
  const { currency, toggleCurrency } = useCurrency();

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('name, slug')
        .eq('store', 'fantech')
        .eq('is_active', true)
        .order('name');
      
      if (data) {
        setCatLinks(data.map(c => ({
          href: `/products?category=${encodeURIComponent(c.name.toLowerCase())}`,
          label: c.name
        })));
      }
    }
    fetchCategories();
  }, []);

  const links = [...baseLinks, ...catLinks, ...endLinks];

  useEffect(() => {
    if (totalItems > prevCountRef.current) {
      setAnimateAdd(true);
      const t = setTimeout(() => setAnimateAdd(false), 900);
      return () => clearTimeout(t);
    }
    prevCountRef.current = totalItems;
  }, [totalItems]);
  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Fantech" className="group inline-flex items-center gap-1 font-semibold text-2xl lg:text-3xl">
          <span className="bg-gradient-to-r from-cyan via-cyan/70 to-navy bg-clip-text text-transparent tracking-wider group-hover:shadow-blueGlow transition">Fantech</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm hover:text-cyan transition">
              {l.label}
            </Link>
          ))}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-2 border border-gray-200">
            <button onClick={() => currency !== 'ARS' && toggleCurrency()} className={`text-xs font-bold rounded-md px-3 py-1 transition ${currency === 'ARS' ? 'bg-white shadow text-navy' : 'text-gray-400 hover:text-navy hover:bg-gray-200/50'}`}>AR$</button>
            <button onClick={() => currency !== 'USD' && toggleCurrency()} className={`text-xs font-bold rounded-md px-3 py-1 transition ${currency === 'USD' ? 'bg-white shadow text-navy' : 'text-gray-400 hover:text-navy hover:bg-gray-200/50'}`}>US$</button>
          </div>
        </nav>
          <button
            onClick={toggleCart}
            aria-label="Carrito"
            className={`relative hidden md:inline-flex p-2 rounded-md transition ${totalItems === 0 ? 'bg-white border border-black hover:bg-white' : 'bg-white hover:bg-gray-100'}`}
          >
          <ShoppingCart size={24} className={totalItems === 0 ? "text-black" : "text-green-600"} />
          <span className={`absolute -top-1 -right-1 min-w-[22px] h-5 px-1.5 text-[11px] rounded-full flex items-center justify-center ${totalItems === 0 ? 'bg-white border border-black text-gray-500' : 'bg-green-500 text-white'} ${animateAdd && totalItems > 0 ? 'cart-added' : ''}`}>
            {totalItems}
          </span>
        </button>
        {/* Botón hamburguesa para mobile (a la derecha del carrito) */}
        <button
          className="md:hidden inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {/* Panel móvil */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur border-t border-gray-200">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="py-2 px-2 rounded-md hover:bg-gray-100 text-navy font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-100 mt-2 pt-3 px-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">Moneda</span>
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                <button onClick={() => currency !== 'ARS' && toggleCurrency()} className={`text-sm font-bold rounded-md px-4 py-1 transition ${currency === 'ARS' ? 'bg-white shadow text-navy' : 'text-gray-400 hover:text-navy hover:bg-gray-200/50'}`}>AR$</button>
                <button onClick={() => currency !== 'USD' && toggleCurrency()} className={`text-sm font-bold rounded-md px-4 py-1 transition ${currency === 'USD' ? 'bg-white shadow text-navy' : 'text-gray-400 hover:text-navy hover:bg-gray-200/50'}`}>US$</button>
              </div>
            </div>
          </nav>
        </div>
      )}
      {/* Línea inferior azul marino brillante */}
        <div className="h-[3px] bg-gradient-to-r from-cyan to-navy"></div>
      </header>
      <button
        onClick={toggleCart}
        aria-label="Carrito"
        className={`md:hidden fixed bottom-5 right-5 z-50 shadow-lg rounded-full p-4 border border-gray-200 bg-white transition hover:scale-105 ${animateAdd && totalItems > 0 ? 'cart-added' : ''}`}
      >
        <div className="relative">
          <ShoppingCart size={26} className={totalItems === 0 ? "text-black" : "text-green-600"} />
          <span className={`absolute -top-2 -right-2 min-w-[22px] h-5 px-1.5 text-[11px] rounded-full flex items-center justify-center ${totalItems === 0 ? 'bg-white border border-black text-gray-500' : 'bg-green-500 text-white'}`}>
            {totalItems}
          </span>
        </div>
      </button>
    </>
  );
}

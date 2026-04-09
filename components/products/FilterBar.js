import { useState, useEffect } from "react";
import Link from "next/link";

export default function FilterBar({ category, onChange }) {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("relevance");
  const [tags, setTags] = useState([]);
  const [activeTags, setActiveTags] = useState([]);

  useEffect(() => {
    onChange({ search, minPrice, maxPrice, sort, tags: activeTags });
  }, [search, minPrice, maxPrice, sort, activeTags, onChange]);

  useEffect(() => {
    const baseTags = ["pro", "plus", "max", "air", "mini", "ultra", "nuevo"];
    const categoryTags = category?.includes("iphone")
      ? ["pro", "plus", "max", "nuevo"]
      : category?.includes("macs")
      ? ["pro", "air", "max"]
      : ["pro", "mini", "ultra"];
    const unique = Array.from(new Set([...categoryTags, ...baseTags]));
    setTags(unique);
    setActiveTags([]);
  }, [category]);

  const toggleTag = (t) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]));
  };

  return (
    <div className="flex flex-col gap-6 bg-white/70 backdrop-blur-md border border-white/50 shadow-sm rounded-2xl p-6">
      {/* Buscador */}
      <div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full bg-graylight border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan transition-all text-navy placeholder:text-navy/50"
        />
      </div>

      {/* Categorías */}
      <div className="flex flex-col gap-1 border-b border-gray-200 pb-6">
        <h3 className="font-black text-navy mb-3 uppercase tracking-widest text-xs">Categorías</h3>
        <Link href="/products" className={`py-2 block font-medium transition-colors ${!category ? 'text-cyan font-bold' : 'text-navy/70 hover:text-cyan'}`}>Todos los Productos</Link>
        <Link href="/products?category=iphone" className={`py-2 block font-medium transition-colors ${category === 'iphone' ? 'text-cyan font-bold' : 'text-navy/70 hover:text-cyan'}`}>iPhone</Link>
        <Link href="/products?category=macs%20%26%20ipads" className={`py-2 block font-medium transition-colors ${category === 'macs & ipads' || category === 'macs%20%26%20ipads' ? 'text-cyan font-bold' : 'text-navy/70 hover:text-cyan'}`}>Macs & iPads</Link>
        <Link href="/products?category=accesorios" className={`py-2 block font-medium transition-colors ${category === 'accesorios' ? 'text-cyan font-bold' : 'text-navy/70 hover:text-cyan'}`}>Accesorios</Link>
      </div>

      {/* Filtros de Precio */}
      <div className="flex flex-col gap-3 pb-6 border-b border-gray-200">
        <h3 className="font-black text-navy uppercase tracking-widest text-xs">Precio Mín / Máx</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Mín"
            className="w-full bg-graylight border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan transition-all text-sm text-navy"
          />
          <span className="text-navy/40 font-medium">-</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Máx"
            className="w-full bg-graylight border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan transition-all text-sm text-navy"
          />
        </div>
      </div>

      {/* Ordenamiento */}
      <div className="flex flex-col gap-3 pb-6 border-b border-gray-200">
        <h3 className="font-black text-navy uppercase tracking-widest text-xs">Ordenar por</h3>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full bg-graylight border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan transition-all text-sm text-navy appearance-none"
        >
          <option value="relevance">Relevancia</option>
          <option value="price-asc">Precio: bajo a alto</option>
          <option value="price-desc">Precio: alto a bajo</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
          <option value="new">Novedades</option>
        </select>
      </div>

      {/* Etiquetas / Tags */}
      <div className="flex flex-col gap-3">
        <h3 className="font-black text-navy uppercase tracking-widest text-xs">Filtros Rápidos</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTags.includes(t)
                  ? "bg-cyan text-white shadow-md shadow-cyan/20"
                  : "bg-graylight text-navy/70 hover:bg-gray-200 hover:text-navy"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

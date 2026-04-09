import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], compact = false }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? 'lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
      {products.map(p => (
        <ProductCard key={p.slug} product={p} compact={compact} />
      ))}
    </div>
  );
}

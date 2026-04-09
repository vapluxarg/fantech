import CartItem from "../components/cart/CartItem";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, checkoutWhatsApp } = useCart();
  const { currency, dolarBlue, formatPrice, calculateTotal } = useCurrency();
  const rawTotal = calculateTotal(items);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold mb-6">Tu Carrito</h1>
      {items.length === 0 ? (
        <p className="text-navy/70">Aún no agregaste productos.</p>
      ) : (
        <div className="grid md:grid-cols-[2fr,1fr] gap-10">
          <div>
            {items.map(it => (
              <CartItem key={it.slug} item={it} onUpdate={updateQuantity} onRemove={removeFromCart} />
            ))}
          </div>
          <aside className="card p-6 h-fit">
            <h2 className="text-xl font-semibold">Resumen</h2>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-navy/70">Total</span>
              <span className="font-semibold">{formatPrice({ price_usd: currency === 'USD' ? rawTotal : 0, price_ars: currency === 'ARS' ? rawTotal : 0 })}</span>
            </div>
            <button className="btn-cta w-full mt-6" onClick={() => checkoutWhatsApp({ currency, formatPrice, dolarBlue })}>Finalizar compra</button>
          </aside>
        </div>
      )}
    </div>
  );
}

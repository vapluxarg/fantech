import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { computeDiscount } from "../../utils/discount";
import { useState } from "react";
import CartItem from "./CartItem";

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, updateQuantity, removeFromCart, checkoutWhatsApp, coupon, applyCoupon, removeCoupon } = useCart();
  const { currency, dolarBlue, formatPrice, calculateTotal } = useCurrency();
  
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  const rawTotal = calculateTotal(items);
  const discountAmount = computeDiscount(coupon, rawTotal, currency, dolarBlue);
  const finalTotal = rawTotal - discountAmount;

  const handleApply = async () => {
    setMsg('...');
    const result = await applyCoupon(code);
    setMsg(result.message);
    if (result.success) setCode('');
  };

  return (
    <div className={`fixed inset-0 z-50 transition ${isOpen ? 'visible' : 'invisible'}`} aria-hidden={!isOpen}>
      <div className={`absolute inset-0 bg-black/20 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
      <aside className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl border-l border-gray-200 transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold">Tu Carrito</h2>
          <button onClick={() => setIsOpen(false)} className="text-sm text-cyan hover:underline">Cerrar</button>
        </div>
        <div className="p-4 h-[calc(100%-250px)] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-navy/70">Tu carrito está vacío.</p>
          ) : (
            items.map(it => (
              <CartItem key={it._cartKey} item={it} onUpdate={updateQuantity} onRemove={removeFromCart} />
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 space-y-3 bg-white absolute bottom-0 w-full left-0">
          {/* Coupon Section */}
          <div className="flex flex-col gap-2">
            {!coupon ? (
              <>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Código de descuento" 
                    value={code} 
                    onChange={e => setCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-cyan"
                  />
                  <button onClick={handleApply} className="px-4 py-2 bg-navy text-white text-sm font-bold rounded-md hover:bg-navy/90 transition">Aplicar</button>
                </div>
                {msg && <p className={`text-xs ${msg.includes('Aplicado') || msg.includes('Cupón') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
              </>
            ) : (
              <div className="flex items-center justify-between bg-green-50 p-2 rounded-md border border-green-100">
                <div>
                  <p className="text-xs font-bold text-green-700 uppercase">{coupon.code}</p>
                  <p className="text-xs text-green-600">Cupón aplicado</p>
                </div>
                <button onClick={removeCoupon} className="text-xs font-bold text-red-500 hover:underline">Quitar</button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-navy/70 pt-2 border-t border-gray-100 mt-2">
            <span>Subtotal</span>
            <span>{formatPrice({ price_usd: currency === 'USD' ? rawTotal : 0, price_ars: currency === 'ARS' ? rawTotal : 0 })}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm text-green-600 font-medium">
              <span>Descuento</span>
              <span>-{formatPrice({ price_usd: currency === 'USD' ? discountAmount : 0, price_ars: currency === 'ARS' ? discountAmount : 0 })}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            <span className="text-base font-bold text-navy">Total</span>
            <span className="font-bold text-cyan text-lg">{formatPrice({ price_usd: currency === 'USD' ? finalTotal : 0, price_ars: currency === 'ARS' ? finalTotal : 0 })}</span>
          </div>
          <button className="btn-cta w-full" onClick={() => checkoutWhatsApp({ currency, formatPrice, dolarBlue })}>Finalizar pedido</button>
        </div>
      </aside>
    </div>
  );
}

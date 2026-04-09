import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { openWhatsAppWithCart } from "../utils/whatsapp";
import { supabase } from "../utils/supabase";

const CartContext = createContext(null);

const STORAGE_KEY = "fantech_cart_v2";
const COUPON_KEY = "fantech_coupon_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const savedItems = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (savedItems) setItems(JSON.parse(savedItems));
      
      const savedCoupon = typeof window !== 'undefined' ? window.localStorage.getItem(COUPON_KEY) : null;
      if (savedCoupon) setCoupon(JSON.parse(savedCoupon));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        if (coupon) {
          window.localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
        } else {
          window.localStorage.removeItem(COUPON_KEY);
        }
      }
    } catch (e) {}
  }, [items, coupon]);

  const totalItems = useMemo(() => items.reduce((a, it) => a + it.quantity, 0), [items]);

  const addToCart = (product, quantity = 1, variant = null) => {
    setItems(prev => {
      const cartKey = variant ? `${product.slug}__${variant.id}` : product.slug;
      
      const idx = prev.findIndex(p => p._cartKey === cartKey);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: Math.min(99, next[idx].quantity + quantity) };
        return next;
      }

      // Add new item
      return [...prev, { 
        _cartKey: cartKey,
        id: product.id, 
        slug: product.slug, 
        name: product.name, 
        image: product.image, 
        quantity,
        variantId: variant?.id,
        variantLabel: variant?.label,
        price_usd: variant ? variant.price_usd : product.price_usd,
        price_ars: variant ? variant.price_ars : product.price_ars,
        preferred_currency: variant ? variant.preferred_currency : (product.preferred_currency || 'usd'),
        has_promo: product.has_promo,
        promo_price: product.promo_price
      }];
    });
  };

  const updateQuantity = (cartKey, quantity) => {
    setItems(prev => prev.map(p => p._cartKey === cartKey ? { ...p, quantity: Math.min(99, Math.max(1, quantity)) } : p));
  };

  const removeFromCart = (cartKey) => {
    setItems(prev => prev.filter(p => p._cartKey !== cartKey));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    if (!code) return { success: false, message: 'Código vacío.' };
    const { data, error } = await supabase
      .from('promocodes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .eq('store', 'fantech')
      .single();

    if (error || !data) {
      return { success: false, message: 'El cupón no existe o expiró.' };
    }

    if (data.max_uses && data.uses_count >= data.max_uses) {
      return { success: false, message: 'El cupón ha superado su límite de usos.' };
    }

    setCoupon(data);
    return { success: true, message: 'Cupón aplicado.' };
  };

  const removeCoupon = () => setCoupon(null);

  const checkoutWhatsApp = (currencyData, phoneNumber = "") => {
    const envPhone = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER : "";
    const targetPhone = (phoneNumber && phoneNumber.trim()) || (envPhone && envPhone.trim()) || "";
    openWhatsAppWithCart(items, coupon, currencyData, targetPhone);
  };

  const value = {
    items,
    totalItems,
    coupon,
    isOpen,
    setIsOpen,
    toggleCart: () => setIsOpen(v => !v),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    checkoutWhatsApp,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

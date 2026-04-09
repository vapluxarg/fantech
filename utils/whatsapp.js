import { computeDiscount } from './discount';

export function buildWhatsAppMessage(items, coupon, currencyData) {
  if (!items || items.length === 0) {
    return encodeURIComponent("Hola, me gustaría hacer una compra. (Carrito vacío)");
  }
  
  const { currency, dolarBlue, formatPrice } = currencyData;
  
  // Compute raw target depending on currency
  const rawTotal = items.reduce((acc, it) => {
    const val = currency === 'USD' 
      ? (it.price_usd || it.price_ars / dolarBlue) 
      : (it.price_ars || it.price_usd * dolarBlue);
    return acc + (val * it.quantity);
  }, 0);
  
  const discountAmount = computeDiscount(coupon, rawTotal, currency, dolarBlue);
  const finalTotal = rawTotal - discountAmount;

  const lines = [
    "Hola, me gustaría finalizar esta compra:",
    "",
    ...items.map((it, i) => {
      const priceText = formatPrice({ price_usd: it.price_usd, price_ars: it.price_ars });
      const varText = it.variantLabel ? ` (${it.variantLabel})` : "";
      return `${i + 1}. ${it.name}${varText} x${it.quantity} — ${priceText} c/u`;
    }),
    "",
  ];

  if (coupon) {
    lines.push(`Subtotal: ${formatPrice({ price_usd: currency === 'USD' ? rawTotal : 0, price_ars: currency === 'ARS' ? rawTotal : 0 })}`);
    lines.push(`Descuento (${coupon.code}): -${formatPrice({ price_usd: currency === 'USD' ? discountAmount : 0, price_ars: currency === 'ARS' ? discountAmount : 0 })}`);
  }
  
  lines.push(`Total a pagar: ${formatPrice({ price_usd: currency === 'USD' ? finalTotal : 0, price_ars: currency === 'ARS' ? finalTotal : 0 })}`);

  return encodeURIComponent(lines.join("\n"));
}

export function openWhatsAppWithCart(items, coupon, currencyData, phoneNumber = "") {
  const text = buildWhatsAppMessage(items, coupon, currencyData);
  const base = phoneNumber ? `https://wa.me/${phoneNumber}` : `https://wa.me/`;
  const url = `${base}?text=${text}`;
  if (typeof window !== 'undefined') {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export function computeDiscount(coupon, rawTotal, currency, dolarBlue) {
  if (!coupon) return 0;

  // percentage discount
  if (coupon.type === 'percentage') {
    const rawDiscount = rawTotal * (coupon.amount / 100);
    // Apply cap
    if (currency === 'USD') {
      const capInUsd = coupon.cap_usd || (coupon.cap_ars ? coupon.cap_ars / dolarBlue : Infinity);
      return Math.min(rawDiscount, capInUsd);
    } else {
      const capInArs = coupon.cap_ars || (coupon.cap_usd ? coupon.cap_usd * dolarBlue : Infinity);
      return Math.min(rawDiscount, capInArs);
    }
  }

  // fixed USD discount
  if (coupon.type === 'fixed_usd') {
    const val = currency === 'USD' ? coupon.amount : coupon.amount * dolarBlue;
    return Math.min(rawTotal, val);
  }

  // fixed ARS discount
  if (coupon.type === 'fixed_ars') {
    const val = currency === 'ARS' ? coupon.amount : coupon.amount / dolarBlue;
    return Math.min(rawTotal, val);
  }

  return 0;
}

export const formatCurrency = (value, locale = 'en-US', currency = 'USD') =>
  new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { getDolarBlue, getDolarCripto } from '../utils/dolar'
import { formatCurrency as formatBase } from '../utils/format'

const CurrencyContext = createContext(null)

const formatUSD = (val) => formatBase(val, 'en-US', 'USD')
const formatARS = (val) => formatBase(val, 'es-AR', 'ARS')

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD') // Fantech default is USD
  const [dolarBlue, setDolarBlue] = useState(1200)
  const [dolarCripto, setDolarCripto] = useState(1200)

  useEffect(() => {
    // Load preference
    const saved = localStorage.getItem('fantech_currency')
    if (saved) setCurrency(saved)

    // Fetch rate
    async function fetchRate() {
      const [blue, cripto] = await Promise.all([getDolarBlue(), getDolarCripto()])
      setDolarBlue(blue)
      setDolarCripto(cripto)
    }
    fetchRate()
  }, [])

  const toggleCurrency = () => {
    const next = currency === 'ARS' ? 'USD' : 'ARS'
    setCurrency(next)
    localStorage.setItem('fantech_currency', next)
  }

  const formatPrice = (p) => {
    if (!p) return ''
    if (typeof p === 'number') {
      // If we just get a number, assume it's in USD (Fantech default) and convert if ARS is selected
      const val = currency === 'USD' ? p : (p * dolarBlue)
      return currency === 'USD' ? formatUSD(val) : formatARS(val)
    }

    // Object with price fields
    const pref = p.preferred_currency || 'usd'
    if (currency === 'USD') {
      let val = 0;
      if (pref === 'ars') val = Number(p.price_ars || 0) / dolarBlue;
      else if (pref === 'usdt') val = (Number(p.price_usdt || p.price || 0) * dolarCripto) / dolarBlue;
      else val = Number(p.price_usd || p.price || 0);
      return formatUSD(val)
    } else {
      let val = 0;
      if (pref === 'ars') val = Number(p.price_ars || 0);
      else if (pref === 'usdt') val = Number(p.price_usdt || p.price || 0) * dolarCripto;
      else val = Number(p.price_usd || p.price || 0) * dolarBlue;
      return formatARS(val)
    }
  }

  const formatPromoPrice = (p) => {
    if (!p || !p.promo_price) return ''
    const val = Number(p.promo_price)
    if (p.preferred_currency === 'usd') {
      return currency === 'USD' ? formatUSD(val) : formatARS(val * dolarBlue)
    } else if (p.preferred_currency === 'usdt') {
      return currency === 'USD' ? formatUSD((val * dolarCripto) / dolarBlue) : formatARS(val * dolarCripto)
    } else {
      return currency === 'ARS' ? formatARS(val) : formatUSD(val / dolarBlue)
    }
  }

  const getProductPrice = (p) => {
    if (!p) return 0
    // Promo
    if (p.has_promo && p.promo_price) {
      const val = Number(p.promo_price)
      if (p.preferred_currency === 'usd') {
        return currency === 'USD' ? val : (val * dolarBlue)
      } else if (p.preferred_currency === 'usdt') {
        return currency === 'USD' ? (val * dolarCripto) / dolarBlue : (val * dolarCripto)
      } else {
        return currency === 'ARS' ? val : (val / dolarBlue)
      }
    }
    // Regular
    const pref = p.preferred_currency || 'usd'
    if (currency === 'USD') {
      if (pref === 'ars') return Number(p.price_ars || 0) / dolarBlue;
      if (pref === 'usdt') return (Number(p.price_usdt || p.price || 0) * dolarCripto) / dolarBlue;
      return Number(p.price_usd || p.price || 0);
    } else {
      if (pref === 'ars') return Number(p.price_ars || 0);
      if (pref === 'usdt') return Number(p.price_usdt || p.price || 0) * dolarCripto;
      return Number(p.price_usd || p.price || 0) * dolarBlue;
    }
  }

  const calculateTotal = (items) => {
    if (!items || !items.length) return 0
    return items.reduce((acc, p) => acc + (getProductPrice(p) * (p.qty || p.quantity || 1)), 0)
  }

  const value = useMemo(() => ({
    currency,
    setCurrency: (c) => {
      setCurrency(c)
      localStorage.setItem('fantech_currency', c)
    },
    toggleCurrency,
    dolarBlue,
    dolarCripto,
    formatPrice,
    formatPromoPrice,
    getProductPrice,
    calculateTotal
  }), [currency, dolarBlue, dolarCripto])

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)

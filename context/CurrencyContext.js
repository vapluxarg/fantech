import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { getDolarBlue } from '../utils/dolar'
import { formatCurrency as formatBase } from '../utils/format'

const CurrencyContext = createContext(null)

const formatUSD = (val) => formatBase(val, 'en-US', 'USD')
const formatARS = (val) => formatBase(val, 'es-AR', 'ARS')

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD') // Fantech default is USD
  const [dolarBlue, setDolarBlue] = useState(1200)

  useEffect(() => {
    // Load preference
    const saved = localStorage.getItem('fantech_currency')
    if (saved) setCurrency(saved)

    // Fetch rate
    async function fetchRate() {
      const rate = await getDolarBlue()
      setDolarBlue(rate)
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
      const val = pref === 'ars' ? (Number(p.price_ars || 0) / dolarBlue) : Number(p.price_usd || p.price || 0)
      return formatUSD(val)
    } else {
      const val = pref === 'ars' ? Number(p.price_ars || 0) : (Number(p.price_usd || p.price || 0) * dolarBlue)
      return formatARS(val)
    }
  }

  const formatPromoPrice = (p) => {
    if (!p || !p.promo_price) return ''
    const val = Number(p.promo_price)
    if (p.preferred_currency === 'usd') {
      return currency === 'USD' ? formatUSD(val) : formatARS(val * dolarBlue)
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
      } else {
        return currency === 'ARS' ? val : (val / dolarBlue)
      }
    }
    // Regular
    const pref = p.preferred_currency || 'usd'
    if (currency === 'USD') {
      return pref === 'ars' ? (Number(p.price_ars || 0) / dolarBlue) : Number(p.price_usd || p.price || 0)
    } else {
      return pref === 'ars' ? Number(p.price_ars || 0) : (Number(p.price_usd || p.price || 0) * dolarBlue)
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
    formatPrice,
    formatPromoPrice,
    getProductPrice,
    calculateTotal
  }), [currency, dolarBlue])

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)

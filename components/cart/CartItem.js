import { useCurrency } from "../../context/CurrencyContext";

export default function CartItem({ item, onUpdate, onRemove }) {
  const { formatPrice } = useCurrency();

  return (
    <div className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-contain p-1 bg-graylight/30" />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-navy text-sm">{item.name}</p>
            {item.variantLabel && (
              <p className="text-xs text-navy/60 font-medium mt-0.5">{item.variantLabel}</p>
            )}
            <p className="text-sm font-bold text-cyan mt-1">{formatPrice(item)}</p>
          </div>
          <button onClick={() => onRemove(item._cartKey)} className="text-xs font-bold text-red-400 hover:text-red-500 hover:underline">Eliminar</button>
        </div>
        <div className="flex items-center gap-2 pt-3">
          <button onClick={() => onUpdate(item._cartKey, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-graylight hover:bg-gray-200 font-bold text-navy transition">-</button>
          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
          <button onClick={() => onUpdate(item._cartKey, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-graylight hover:bg-gray-200 font-bold text-navy transition">+</button>
        </div>
      </div>
    </div>
  );
}

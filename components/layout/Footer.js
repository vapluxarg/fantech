import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="text-lg font-semibold">Fantech</div>
            <p className="mt-2 text-white/70 text-sm">Tecnología premium. Diseño confiable.</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-white/90">Navegación</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="text-white hover:text-cyan transition">Inicio</Link></li>
              <li><Link href="/products?category=iphone" className="text-white hover:text-cyan transition">iPhone</Link></li>
              <li><Link href="/products?category=macs%20%26%20ipads" className="text-white hover:text-cyan transition">Macs & iPads</Link></li>
              <li><Link href="/products?category=accesorios" className="text-white hover:text-cyan transition">Accesorios</Link></li>
              <li><Link href="/products" className="text-white hover:text-cyan transition">Todos los productos</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white/90">Soporte</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`} target="_blank" rel="noreferrer" className="text-white hover:text-cyan transition">Contacto por WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white/90">Legal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="text-white/60">No afiliado a Apple.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white/90">Contacto</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`} target="_blank" rel="noreferrer" className="text-white hover:text-cyan transition">WhatsApp</a></li>
              <li><a href="mailto:contacto@fantech.test" className="text-white hover:text-cyan transition">contacto@fantech.test</a></li>
              <li className="text-white/70">Lun a Vie 9-18hs</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-cyan to-transparent opacity-50" />
        <div className="mt-6 text-sm text-white/70">© {year} Fantech. Todos los derechos reservados.</div>
      </div>
    </footer>
  );
}

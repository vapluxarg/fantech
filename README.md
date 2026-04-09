# Fantech E-commerce

Sitio de e-commerce premium inspirado en la estética minimalista del ecosistema Apple. 
El proyecto evolucionó de un catálogo estático a una plataforma completa y dinámica, integrando base de datos, gestión de variantes de productos, cálculo multimeda en tiempo real y cupones de descuento.

## 🚀 Stack Tecnológico

- **Frontend:** Next.js 14 (Pages Router) + React 18
- **Estilos:** Tailwind CSS (Custom theme)
- **Base de Datos / Backend:** Supabase (PostgreSQL)
- **Estado Global:** Context API (`CartContext`, `CurrencyContext`)
- **Iconografía:** `lucide-react`

## ✨ Características Principales

1. **Catálogo Dinámico (Supabase)**
   - Productos almacenados en base de datos en lugar de un mock local.
   - Soporte para **Variantes de Producto** (colores, almacenamiento, etc.), con control de stock y precios independientes por cada variante.
2. **Sistema Multimoneda**
   - Soporte para visualización global en ARS (Pesos) o USD (Dólares).
   - Uso de `CurrencyContext` y `dolar.js` para la conversión en base al tipo de cambio configurado/obtenido.
3. **Carrito y Descuentos**
   - Estado del carrito persistente y accesible a lo largo de toda la aplicación.
   - Motor de descuentos (`discount.js`) para aplicación de cupones directamente en el carrito.
4. **Checkout optimizado por WhatsApp**
   - Generación automática de un recibo estructurado con el detalle de los productos, variantes y monedas.
   - Redirección automatizada vía API de WhatsApp.

## 📂 Estructura del Proyecto

- `components/layout`: Componentes estructurales (`Navbar`, `Footer`, etc.)
- `components/products`: Tarjetas, grillas y filtros de productos (`ProductCard`, `ProductGrid`, `FilterBar`, etc.)
- `components/cart`: Drawer/panel lateral e ítems individuales (`CartDrawer`, `CartItem`)
- `context`: Manejo de estado de React (`CartContext`, `CurrencyContext`)
- `pages`: Rutas del frontend (Home, Detalles de Producto, Carrito, etc.)
- `utils`: Utilidades generales (`supabase.js` para la conexión a la DB, `format.js` para texto/moneda, `dolar.js`, `discount.js` y `whatsapp.js`)

## 🛠 Variables de Entorno

Debes crear un archivo `.env.local` en la raíz del proyecto para que la app pueda comunicarse con tu backend en Supabase y el número de ventas correcto:

```env
# Conexión a Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase

# Número para Checkout de WhatsApp (formato internacional sin "+", ej: 5491123456789)
NEXT_PUBLIC_WHATSAPP_NUMBER=tu_numero_wa
```

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Servir el build
npm start
```

## 🚀 Deploy (Vercel)

1. Conecta el repositorio a tu cuenta de Vercel. Automáticamente detectará Next.js.
2. En la sección **Environment Variables** de los ajustes, asegúrate de colocar las claves de Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) y tu número de ventas (`NEXT_PUBLIC_WHATSAPP_NUMBER`).
3. Vercel realizará el build (`npm run build`) y desplegará la aplicación.
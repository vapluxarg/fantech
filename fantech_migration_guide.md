# Guía de Migración de Fantech (Código Estático a Supabase)

Esta documentación guía la refactorización del proyecto **Fantech** de un sitio estático a uno dinámico, utilizando la misma arquitectura Multi-tenant de la Base de Datos implementada para **Vaplux**.

---

## 1. Modelos de la Base de Datos (Esquemas)

La base de datos en Supabase está centralizada y estructurada para soportar múltiples tiendas (Multi-tenant). Todos los modelos utilizan la columna `store` para distinguir a qué proyecto pertenece el registro (`'vaplux'` o `'fantech'`).

### A. Tabla `categories`
Almacena las categorías principales.
- **id** (UUID): Identificador único.
- **name** (String): Nombre visible (Ej: "Periféricos").
- **slug** (String): URL amigable (Ej: "perifericos").
- **store** (String): `'fantech'` o `'vaplux'`.
- **is_active** (Boolean): Determina si se muestra en el frontend.
- **created_at** (Timestamp): Fecha de creación.

### B. Tabla `subcategories`
Categorías de segundo nivel (opcionales).
- **id** (UUID).
- **category_id** (UUID): Referencia a `categories`.
- **name** (String).
- **slug** (String).
- **created_at** (Timestamp).

### C. Tabla `products`
- **id** (UUID): Identificador único.
- **title** (String): Nombre del producto.
- **slug** (String): Parte de la ruta (Ej: "teclado-mecanico-x1").
- **category_id** (UUID): Relación con `categories`.
- **store** (String): `'fantech'` o `'vaplux'`.
- **is_active** (Boolean): Si está pausado o libre para la venta.
- **stock** (Integer): Inventario del producto.
- **price_usd** (Float): Precio en dólares.
- **price_ars** (Float): Precio en pesos.
- **preferred_currency** (String): Moneda base (`'usd'` o `'ars'`).
- **image_urls** (Array[String]): Enlaces CDN de las fotos (Supabase Storage).
- **has_promo** (Boolean), **promo_price** (Float): Manejo de promociones.
- **Métricas Internas:** `views_count`, `added_to_cart_count`, `whatsapp_clicks`, `meli_clicks`.

### D. Tabla `promotions`
Banners o promociones destacadas de la tienda.
- **id** (UUID).
- **title**, **short_description**, **banner_image_url** (Strings).
- **expires_at** (Timestamp).
- **is_active** (Boolean).

---

## 2. Configuración y Conexión Backend

Asegúrese de inicializar supabase exportando una instancia única ([utils/supabase.js](file:///c:/Users/gianq/OneDrive/Documentos/vaplux/utils/supabase.js)) usando las variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

```javascript
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

---

## 3. Data Fetching y Consultas Comunes

Dentro de Fantech (por ejemplo en [getServerSideProps](file:///c:/Users/gianq/OneDrive/Documentos/vaplux/pages/index.js#11-56)), extraiga únicamente datos correspondientes a `store='fantech'` y `is_active=true`.

### Extraer Productos y Categorías Activos
```javascript
// Obtener categorías de Fantech
const { data: categories } = await supabase
  .from('categories')
  .select('id, name, slug')
  .eq('store', 'fantech')
  .eq('is_active', true)
  .order('name');

// Obtener productos de Fantech
const { data: products } = await supabase
  .from('products')
  .select('id, title, price_ars, price_usd, image_urls, preferred_currency, slug, has_promo, promo_price, category_id')
  .eq('store', 'fantech')
  .eq('is_active', true);
```

---

## 4. Analíticas y Registro de Eventos (RPC)

Para medir conversiones eficientemente y utilizar esos datos como recomendador, Vaplux usa funciones de servidor (RPC) que evitan vulnerabilidades en el lado cliente e impiden saltos de concurrencia. Deberás implementarlo en Fantech copiando el [utils/analytics.js](file:///c:/Users/gianq/OneDrive/Documentos/vaplux/utils/analytics.js) y usándolo en la UI:

### Eventos de Productos disponibles
Implementa esto en botones transaccionales y páginas de producto:
- `'view'`: Vista simple. Incrementa `views_count`.
- `'cart_add'`: Agregar al carrito. Incrementa `added_to_cart_count`.
- `'whatsapp_checkout'`: Compra rápida. (Incrementa `whatsapp_clicks` y `added_to_cart_count`).
- `'meli_click'`: Derivación a MercadoLibre. Incrementa `meli_clicks`.

**Ejemplo de implementación (Frontend):**
```javascript
import { trackProductEvent } from '@/utils/analytics'

// En el onClick() de "Comprar por WhatsApp":
trackProductEvent('whatsapp_checkout', product.id);
```

---

## 5. El Panel de Administración y Operaciones CRUD

No hace falta programar un nuevo panel para Fantech. El Panel de Vaplux en `/admin` ya detecta múltiples tiendas. El CRUD funciona así:

- **Create/Insert:** Identifica la variable `globalStore` (en el caso de ser administrador logueado) o la selección de Store en la UI (los radio buttons Vapor/Fantech) para definir a qué e-commerce se asigna al guardar.
- **Read:** La consulta hace fetch general de `.from('products')`. Luego usa `.filter(p => p.store === globalStore)` si el usuario restringió su vista.
- **Update:** Al pausar productos ([toggleActive](file:///c:/Users/gianq/OneDrive/Documentos/vaplux/pages/admin/products/index.js#34-40)), cambia el flag `is_active` (afecta la UI pública instantáneamente). Las actualizaciones de stock y precios se hacen sobre el identificador ([id](file:///c:/Users/gianq/OneDrive/Documentos/vaplux/pages/index.js#11-56)).
- **Exportación masiva:** Cruza las peticiones sumando un generador PNG o la conversión del `preferred_currency` multiplicándolo por la cotización viva extraída de `getDolarBlue()`. Todo producto sin stock (`stock <= 0`) queda excluido de estas listas dinámicas.

---

## 6. Coherencia Estética (Stitch Design System)

Por último, actualice el [tailwind.config.js](file:///c:/Users/gianq/OneDrive/Documentos/vaplux/tailwind.config.js) de Fantech para igualar los esquemas modernos de iluminación Dark Mode global y las animaciones interactivas (`blueGlow`, `clickPop`). 

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#0066ff",         
        primary: "#0A3D62",       
        accent: "#0066ff",        
        surface: "#ffffff",       
        slateInk: "#1E293B",      
      },
      boxShadow: {
        brandGlow: "0 8px 24px rgba(0, 102, 255, 0.25)",
      },
      animation: {
        clickPop: 'clickPop 200ms ease-out',
      },
      keyframes: {
        clickPop: { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(0.96)' } },
      },
      borderRadius: {
        lg: '8px',
        xl: '1rem',
      }
    },
  },
  plugins: [],
};
```

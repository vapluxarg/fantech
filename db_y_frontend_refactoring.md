# 📦 Documentación de Refactorización — Vaplux
**Fecha:** Abril 2026  
**Objetivo:** Soporte para productos importados a pedido, visualización de sin stock, y variantes de producto con precios independientes.

---

## 🗄️ Estado Actual de la Base de Datos

### Tabla: `products` (modificada)

| Columna | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | uuid | gen_random_uuid() | PK |
| `title` | text | — | Nombre comercial |
| `slug` | text | — | URL única |
| `store` | text | `'vaplux'` | Tienda origen |
| `category_id` | uuid | null | FK → categories |
| `subcategory_id` | uuid | null | FK → subcategories |
| `description` | text | null | Especificaciones (una por línea) |
| `price_usd` | numeric | null | Precio base en USD |
| `price_ars` | numeric | null | Precio base en ARS |
| `preferred_currency` | text | `'usd'` | Moneda principal del producto |
| `image_urls` | text[] | `'{}'` | Array de URLs de imágenes |
| `video_url` | text | null | URL de video opcional |
| `ml_link` | text | null | Enlace a MercadoLibre |
| `stock` | integer | `0` | Stock disponible. **NULL si el producto es importado** |
| `has_promo` | boolean | `false` | Tiene precio promocional activo |
| `promo_price` | numeric | null | Precio promo (en la moneda de `preferred_currency`) |
| `is_active` | boolean | `true` | Visible en el frontend |
| `is_imported` | boolean | `false` | ⭐ NUEVO — Si `true`: a pedido, sin stock, aparece en `/importados` |
| `has_variants` | boolean | `false` | ⭐ NUEVO — Si `true`: tiene variantes de precio/stock en `product_variants` |
| `views_count` | integer | `0` | Analítica |
| `whatsapp_clicks` | integer | `0` | Analítica |
| `meli_clicks` | integer | `0` | Analítica |
| `added_to_cart_count` | integer | `0` | Analítica |
| `created_at` | timestamptz | now() | — |
| `updated_at` | timestamptz | now() | — |

> **Regla:** Cuando `has_variants = true`, el precio y stock a mostrar proviene de `product_variants`, no de `price_usd`/`price_ars`/`stock` del producto padre.
> **Regla:** Cuando `is_imported = true`, el campo `stock` se guarda como `NULL` y nunca se muestra al usuario.

---

### Tabla: `product_variants` (NUEVA)

| Columna | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | uuid | gen_random_uuid() | PK |
| `product_id` | uuid | — | FK → products(id) ON DELETE CASCADE |
| `label` | text | — | Etiqueta legible. Ej: `"Rojo / 128GB"` |
| `attributes` | jsonb | `'{}'` | Atributos estructurados. Ej: `{"Color": "Rojo", "Memoria": "128GB"}` |
| `price_usd` | numeric | null | Precio USD de esta variante |
| `price_ars` | numeric | null | Precio ARS de esta variante |
| `preferred_currency` | text | `'usd'` | Moneda principal de esta variante |
| `stock` | integer | null | Stock de esta variante. **NULL si el producto padre es importado** |
| `is_active` | boolean | `true` | Visible en el frontend |
| `created_at` | timestamptz | now() | — |
| `updated_at` | timestamptz | now() | — |

#### Políticas RLS

| Política | Operación | Condición |
|---|---|---|
| Public read active variants | SELECT | `is_active = true` AND producto padre `is_active = true` |
| Service role full access | ALL | `true` |

#### Índice
```sql
CREATE INDEX idx_product_variants_product_id ON public.product_variants (product_id);
```

---

### Diagrama de relaciones

```
categories
  └── products  ──────────────────────────────────► product_variants
        ├── is_imported: bool                            ├── label
        ├── has_variants: bool                           ├── attributes (jsonb) {"Color":"Rojo","Memoria":"128GB"}
        ├── price_usd / price_ars (base o referencia)   ├── price_usd / price_ars
        └── stock (NULL si importado)                    └── stock (NULL si importado)
```

---

## 🌐 Cambios en el Frontend Público

### 1. `Navbar.jsx`

- Se agregó el enlace **"📦 Importados"** en la barra de escritorio, entre "Catálogo" y "Servicios", con color ámbar.
- En el drawer móvil se insertó una tarjeta con fondo ámbar que lleva a `/importados` con el texto "A pedido".

---

### 2. `pages/catalog/index.js`

| Aspecto | Antes | Después |
|---|---|---|
| Filtro de productos | Todos los activos | Solo `is_imported = false` |
| Datos de variantes | No se traían | Join con `product_variants` para calcular `_variantMinPrice` |
| Subtítulo de sección | No existía | "Con stock para entrega inmediata" (verde) |
| Precio en cards | Precio base | Si tiene variantes: "Desde $X" |

**Query actualizada:**
```js
supabase
  .from('products')
  .select('*, categories(name, id), product_variants(price_usd, price_ars, preferred_currency, stock)')
  .eq('is_active', true)
  .eq('store', 'vaplux')
  .eq('is_imported', false)
```

**Lógica de precio mínimo:**
```js
const variantPrices = (p.product_variants || []).flatMap(v => [
  v.preferred_currency === 'usd' ? (v.price_usd || 0) : null,
  v.preferred_currency === 'ars' ? (v.price_ars || 0) : null
]).filter(x => x !== null && x > 0)

_variantMinPrice: variantPrices.length > 0 ? Math.min(...variantPrices) : null
```

---

### 3. `components/ProductCard.jsx`

**Overlay "Sin Stock"** — aparece cuando `!is_imported && !has_variants && stock === 0`:
- Capa semitransparente blanca sobre la imagen con ícono `PackageX` y texto "Sin Stock"

**Overlay "A Pedido"** — aparece cuando `is_imported === true`:
- Capa ámbar semitransparente con ícono `Clock` y texto "A pedido"

**Precio "Desde $X"** — aparece cuando `has_variants === true && _variantMinPrice > 0`:
```jsx
<p>
  <span className="text-xs text-gray-500">Desde</span>
  {formatPrice(product._variantMinPrice)}
</p>
```

---

### 4. `pages/importados/index.js` (PÁGINA NUEVA)

Clon del catálogo con estas diferencias clave:

| Aspecto | Catálogo | Importados |
|---|---|---|
| Filtro DB | `is_imported = false` | `is_imported = true` |
| Subtítulo sidebar | "Con stock para entrega inmediata" | "Productos a pedido · Demora 7 días" |
| Banner informativo | No | Sí — franja ámbar al tope |
| Filtro Solo Promos | Sí | No |
| Link consulta WA | No | Sí (sidebar + banner) |
| Paleta de color | Azul | Ámbar |
| Empty state | Texto genérico | CTA de consulta por WA |

**Banner informativo (siempre visible):**
```
🕐 Productos a Pedido · Demora estimada 7 días
   Estos productos son importados y no tienen stock inmediato.
   ¿Buscás algo que no está? → Consultanos por WhatsApp
```

---

### 5. `components/PurchasePanel.jsx` (rediseño completo)

#### Escenario A — Producto simple
Sin cambios visuales. Cantidad limitada por `stock`, botón deshabilitado si `stock = 0`.

#### Escenario B — Producto importado
- Banner ámbar: *"Producto Importado · A Pedido — Tiempo estimado: 7 días hábiles"*
- Sin restricción de cantidad en el selector
- Disponibilidad: "A pedido · 7 días"
- Botón siempre habilitado

#### Escenario C — Producto con variantes
- Selectores de atributos por dominio (Color, Memoria, etc.) — las combinaciones inválidas quedan deshabilitadas.
- Precio dinámico en tiempo real según variante seleccionada (con conversión USD↔ARS vía dólar blue).
- Stock dinámico por variante. Mientras no se selecciona todo muestra "Elegí variante".
- Botón deshabilitado hasta elegir variante completa (o si esa variante tiene stock 0).

**Mensaje de WhatsApp con variante:**
```
▪ iPhone 16 Pro (Cant: 1)
▪ Variante: *256GB / Negro Espacial*
💰 Total estimado: U$D 850
```

---

### 6. `pages/product/[slug].js`

- `getStaticProps` ahora consulta `product_variants` para el producto:
```js
const { data: rawVariants } = await supabase
  .from('product_variants')
  .select('*')
  .eq('product_id', rawProduct.id)
  .eq('is_active', true)
  .order('created_at')
```
- Las variantes se pasan como prop: `<PurchasePanel variants={variants} />`
- `handleWhatsApp(product, qty, variant)` incluye la variante seleccionada en el mensaje

---

### 7. `context/CartContext.js`

- `add(product, qty, variant)` acepta variante opcional.
- Clave única por ítem: `_cartKey = "${product.id}__${variant.id}"` (o `__base` si no hay variante).
- Permite el mismo producto con distintas variantes en simultáneo en el carrito.
- `price_usd`, `price_ars` y `preferred_currency` del ítem se sobrescriben con los de la variante al agregar.
- `remove` y `setQty` operan sobre `_cartKey`.

---

## 🔄 Flujo Completo de Datos

```
Admin crea producto
  ├── Simple           → price_usd/price_ars + stock en products
  ├── Importado        → is_imported=true, stock=NULL
  └── Con variantes    → has_variants=true + filas en product_variants

Catálogo (/catalog)
  └── is_imported=false + join variants → precio "Desde $X" si aplica

Importados (/importados)
  └── is_imported=true → banner + sin campo stock

Página de Producto (/product/[slug])
  ├── Trae product_variants
  ├── Selectores de atributos → precio/stock dinámico
  └── Mensaje WA incluye variante elegida

Carrito
  └── Distingue variantes del mismo producto por _cartKey
```

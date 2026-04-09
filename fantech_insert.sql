-- Fantech Migration
-- Insert Categories
INSERT INTO categories (name, slug, store, is_active) VALUES ('iPhone', 'iphone', 'fantech', true) ON CONFLICT (store, slug) DO NOTHING;
INSERT INTO categories (name, slug, store, is_active) VALUES ('Macs & iPads', 'macs-ipads', 'fantech', true) ON CONFLICT (store, slug) DO NOTHING;
INSERT INTO categories (name, slug, store, is_active) VALUES ('Accesorios', 'accesorios', 'fantech', true) ON CONFLICT (store, slug) DO NOTHING;

-- Insert Products

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 14', 
    'iphone-14', 
    v_cat_id, 
    'fantech', 
    true, 
    25, 
    699, 
    733950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_600910-CBT95519430780_102025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 14 Plus', 
    'iphone-14-plus', 
    v_cat_id, 
    'fantech', 
    true, 
    18, 
    799, 
    838950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_667081-CBT89722614421_082025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 14 Pro', 
    'iphone-14-pro', 
    v_cat_id, 
    'fantech', 
    true, 
    12, 
    899, 
    943950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_NQ_NP_2X_763700-MLA96419526706_102025-F.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 14 Pro Max', 
    'iphone-14-pro-max', 
    v_cat_id, 
    'fantech', 
    true, 
    10, 
    999, 
    1048950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_645779-MLA95668080168_102025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 15', 
    'iphone-15', 
    v_cat_id, 
    'fantech', 
    true, 
    30, 
    799, 
    838950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_784557-MLA95493924244_102025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 15 Plus', 
    'iphone-15-plus', 
    v_cat_id, 
    'fantech', 
    true, 
    20, 
    899, 
    943950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_920684-MLA93741925347_092025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 15 Pro', 
    'iphone-15-pro', 
    v_cat_id, 
    'fantech', 
    true, 
    14, 
    999, 
    1048950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_800061-MLA96243557327_102025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 15 Pro Max', 
    'iphone-15-pro-max', 
    v_cat_id, 
    'fantech', 
    true, 
    9, 
    1199, 
    1258950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_756338-MLA101003518215_122025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 16', 
    'iphone-16', 
    v_cat_id, 
    'fantech', 
    true, 
    28, 
    805, 
    845250, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_829645-MLA99458858322_112025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 16 Plus', 
    'iphone-16-plus', 
    v_cat_id, 
    'fantech', 
    true, 
    18, 
    899, 
    943950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_885663-MLA96417875444_102025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 16 Pro', 
    'iphone-16-pro', 
    v_cat_id, 
    'fantech', 
    true, 
    12, 
    999, 
    1048950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_864108-MLA99979989417_112025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 16 Pro Max', 
    'iphone-16-pro-max', 
    v_cat_id, 
    'fantech', 
    true, 
    8, 
    1199, 
    1258950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_612810-MLA94448870326_102025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 17', 
    'iphone-17', 
    v_cat_id, 
    'fantech', 
    true, 
    24, 
    1030, 
    1081500, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_951124-MLA92147446613_092025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 17 Air', 
    'iphone-17-air', 
    v_cat_id, 
    'fantech', 
    true, 
    16, 
    899, 
    943950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_845027-MLA91746100784_092025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 17 Pro', 
    'iphone-17-pro', 
    v_cat_id, 
    'fantech', 
    true, 
    10, 
    1360, 
    1428000, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_822022-MLA92148775743_092025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='iphone' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPhone 17 Pro Max', 
    'iphone-17-pro-max', 
    v_cat_id, 
    'fantech', 
    true, 
    6, 
    1520, 
    1596000, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_926565-MLA91747296620_092025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'MacBook Air 13″ (M4)', 
    'macbook-air-13-m4', 
    v_cat_id, 
    'fantech', 
    true, 
    15, 
    1050, 
    1102500, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_NQ_NP_2X_872887-MLA100980768647_122025-F.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'MacBook Air 15″ (M4)', 
    'macbook-air-15-m4', 
    v_cat_id, 
    'fantech', 
    true, 
    12, 
    1260, 
    1323000, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_NQ_NP_914457-MLA100489728368_122025-OO.jpg']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'MacBook Pro 14″ (M5)', 
    'macbook-pro-14-m5', 
    v_cat_id, 
    'fantech', 
    true, 
    8, 
    1999, 
    2098950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_623142-MLA89067575253_072025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'MacBook Pro 16″ (M5)', 
    'macbook-pro-16-m5', 
    v_cat_id, 
    'fantech', 
    true, 
    6, 
    2499, 
    2623950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_710012-MLA85877176581_062025-F.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iMac (M4)', 
    'imac-m4', 
    v_cat_id, 
    'fantech', 
    true, 
    10, 
    1299, 
    1363950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_671490-MLA96116652481_102025-F.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'Mac mini (M4)', 
    'mac-mini-m4', 
    v_cat_id, 
    'fantech', 
    true, 
    20, 
    599, 
    628950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_749077-MLA100168037110_122025-F.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'Mac mini (M4 Pro)', 
    'mac-mini-m4-pro', 
    v_cat_id, 
    'fantech', 
    true, 
    14, 
    1399, 
    1468950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_827199-MLA84725005406_052025-F.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'Mac Studio (M4 Max)', 
    'mac-studio-m4-max', 
    v_cat_id, 
    'fantech', 
    true, 
    5, 
    1999, 
    2098950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_950450-MLA94029084721_102025-F.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPad Pro 11″ (M5)', 
    'ipad-pro-11-m5', 
    v_cat_id, 
    'fantech', 
    true, 
    16, 
    1160, 
    1218000, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_918436-MLA90580125189_082025-F.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPad Pro 13″ (M5)', 
    'ipad-pro-13-m5', 
    v_cat_id, 
    'fantech', 
    true, 
    12, 
    1670, 
    1753500, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_610644-CBT99440359956_112025-F.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPad Air 11″ (M3)', 
    'ipad-air-11-m3', 
    v_cat_id, 
    'fantech', 
    true, 
    18, 
    680, 
    714000, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_2X_805361-MLA98181340000_112025-V.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='macs-ipads' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'iPad Air 13″ (M3)', 
    'ipad-air-13-m3', 
    v_cat_id, 
    'fantech', 
    true, 
    14, 
    899, 
    943950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_2X_688245-MLA95103081876_102025-E.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='accesorios' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'Magnetic Wireless Charger 30W', 
    'magnetic-wireless-charger-30w', 
    v_cat_id, 
    'fantech', 
    true, 
    50, 
    29, 
    30450, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_790961-MLU78238618224_082024-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='accesorios' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'AirPods Pro 3', 
    'airpods-pro-3', 
    v_cat_id, 
    'fantech', 
    true, 
    25, 
    249, 
    261450, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_NQ_NP_2X_889162-MLA92242288687_092025-F.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='accesorios' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'AirPods 4 (ANC)', 
    'airpods-4-anc', 
    v_cat_id, 
    'fantech', 
    true, 
    30, 
    179, 
    187950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_2X_864720-MLA99454013258_112025-V.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='accesorios' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'AirPods 4', 
    'airpods-4', 
    v_cat_id, 
    'fantech', 
    true, 
    35, 
    129, 
    135450, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_2X_864720-MLA99454013258_112025-V.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='accesorios' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'USB‑C Digital AV Multiport Adapter', 
    'usb-c-digital-av-multiport-adapter', 
    v_cat_id, 
    'fantech', 
    true, 
    40, 
    69, 
    72450, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_2X_647030-MLA91197533300_092025-V.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='accesorios' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'USB‑C to 3.5 mm Headphone Jack Adapter', 
    'usb-c-to-3-5mm-adapter', 
    v_cat_id, 
    'fantech', 
    true, 
    60, 
    9, 
    9450, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_2X_750344-MLA32304592261_092019-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  SELECT id INTO v_cat_id FROM categories WHERE store='fantech' AND slug='accesorios' LIMIT 1;
  
  INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) 
  VALUES (
    'MagSafe Charger (USB‑C)', 
    'magsafe-charger-usb-c', 
    v_cat_id, 
    'fantech', 
    true, 
    50, 
    39, 
    40950, 
    'usd', 
    ARRAY['https://http2.mlstatic.com/D_Q_NP_770100-MLA100300958312_122025-B.webp']
  ) ON CONFLICT DO NOTHING;
END $$;

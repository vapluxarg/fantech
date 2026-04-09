const fs = require('fs');

async function generate() {
  const module = await import('../data/products.js');
  const products = module.products;

  let sql = `-- Fantech Migration\n`;

  const categoryNames = [...new Set(products.map(p => p.category))];
  
  // Insert Categories
  sql += `INSERT INTO categories (name, slug, store, is_active) VALUES \n`;
  const catValues = categoryNames.map(name => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-ft';
    return `('${name}', '${slug}', 'fantech', true)`;
  });
  sql += catValues.join(',\n') + ` ON CONFLICT (store, slug) DO NOTHING;\n\n`;

  // Insert Products
  sql += `INSERT INTO products (title, slug, category_id, store, is_active, stock, price_usd, price_ars, preferred_currency, image_urls) VALUES \n`;
  
  const prodValues = products.map(p => {
    const catSlug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-ft';
    const title = p.name.replace(/'/g, "''");
    
    return `('${title}', '${p.slug}', (SELECT id FROM categories WHERE store='fantech' AND slug='${catSlug}' LIMIT 1), 'fantech', true, ${p.stock}, ${p.price}, ${p.price * 1050}, 'usd', ARRAY['${p.image}'])`;
  });
  
  sql += prodValues.join(',\n') + ` ON CONFLICT DO NOTHING;\n`;
  
  fs.writeFileSync('fantech_insert_compact.sql', sql);
  console.log('SQL generated: fantech_insert_compact.sql');
}

generate().catch(console.error);

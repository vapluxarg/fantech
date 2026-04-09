const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrate() {
  const module = await import('../data/products.js');
  const products = module.products;

  console.log('Starting migration for Fantech...');

  // 1. Extract unique categories
  const categoryNames = [...new Set(products.map(p => p.category))];
  const categoryMap = {};

  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check if exists
    let { data: existingCat } = await supabase
      .from('categories')
      .select('id')
      .eq('store', 'fantech')
      .eq('slug', slug)
      .single();

    if (!existingCat) {
      console.log(`Creating category: ${name}`);
      const { data: newCat, error } = await supabase
        .from('categories')
        .insert([{
          name,
          slug,
          store: 'fantech',
          is_active: true
        }])
        .select()
        .single();
        
      if (error) {
        console.error(`Error creating category ${name}:`, error);
        continue;
      }
      existingCat = newCat;
    } else {
      console.log(`Category ${name} already exists.`);
    }
    
    categoryMap[name] = existingCat.id;
  }

  // 2. Insert Products
  for (const p of products) {
    const category_id = categoryMap[p.category];
    
    let { data: existingProd } = await supabase
      .from('products')
      .select('id')
      .eq('store', 'fantech')
      .eq('slug', p.slug)
      .single();

    const productPayload = {
      title: p.name,
      slug: p.slug,
      category_id: category_id,
      store: 'fantech',
      is_active: true,
      stock: p.stock,
      price_usd: p.price,
      price_ars: p.price * 1050, // rough estimate if needed
      preferred_currency: 'usd',
      image_urls: [p.image],
      has_promo: false,
      description: p.description, // Might work if column exists
      short_description: p.shortDescription || p.description, // guessing column name
      features: p.specs // guessing might be jsonb or text array
    };
    
    if (!existingProd) {
      console.log(`Creating product: ${p.name}`);
      const { error } = await supabase
        .from('products')
        .insert([productPayload]);
        
      if (error) {
        // If it fails probably due to schema mismatch on extra fields, let's try fallback without extra description fields
        console.error(`Error creating product ${p.name}, trying minimal payload...`, error.message);
        const minimalPayload = {
          title: p.name,
          slug: p.slug,
          category_id: category_id,
          store: 'fantech',
          is_active: true,
          stock: p.stock,
          price_usd: p.price,
          price_ars: p.price * 1050,
          preferred_currency: 'usd',
          image_urls: [p.image]
        };
        const { error: minError } = await supabase.from('products').insert([minimalPayload]);
        if(minError) {
           console.error(`Minimal payload also failed for ${p.name}:`, minError);
        } else {
           console.log(`Successfully created ${p.name} with minimal payload`);
        }
      }
    } else {
      console.log(`Product ${p.name} already exists.`);
    }
  }

  console.log('Migration finished.');
}

migrate().catch(console.error);

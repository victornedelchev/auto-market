import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Use node --env-file=.env to load env vars

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const IMAGE_DIR = 'C:\\Users\\victo\\.gemini\\antigravity-ide\\brain\\37a680ec-3582-47bc-8301-d6610819583a';

// Pre-defined mapping of models to the generated image prefixes
const mapping = {
  'Camry': 'camry_2019_1783605442652.png',
  'Civic': 'civic_2015_1783605453031.png',
  '330i': 'bmw_330i_2021_1783605463787.png',
  'Mustang': 'mustang_2018_1783605473627.png',
  'A4': 'audi_a4_2020_1783605483149.png',
  'Golf': 'golf_gti_2016_1783605500022.png',
  'Model 3': 'model3_2022_1783605508406.png',
  'C-Class': 'c300_2017_1783605518034.png',
  'RAV4': 'rav4_2019_1783605527591.png',
  'Accord': 'accord_2018_1783605536864.png',
  '5-Series': 'bmw_528i_2014_1783605554319.png',
  'F-150': 'f150_2021_1783605565037.png',
  'Q5': 'audi_q5_2015_1783605573289.png',
  'Jetta': 'jetta_2019_1783605583728.png',
  'Model Y': 'modely_2023_1783605593245.png',
  'E-Class': 'e350_2016_1783605609416.png',
  'Corolla': 'corolla_2020_1783605619309.png',
  // Fallbacks for the 3 failed generations:
  'CR-V': 'rav4_2019_1783605527591.png',      // Use RAV4 for CR-V
  'X3': 'bmw_330i_2021_1783605463787.png',      // Use BMW 330i for BMW X3
  'Explorer': 'f150_2021_1783605565037.png' // Use F150 for Explorer
};

async function run() {
  console.log('Fetching latest 20 listings...');
  const { data: listings, error } = await supabase
    .from('car_listings')
    .select('id, title, brand, model')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching listings:', error);
    return;
  }

  for (const listing of listings) {
    const filename = mapping[listing.model];
    if (!filename) {
      console.warn(`No mapping found for ${listing.model}`);
      continue;
    }

    const filePath = path.join(IMAGE_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`File does not exist: ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // We upload it to listings bucket as <listingId>/<timestamp>_cover.png
    const timestamp = Date.now();
    const destination = `${listing.id}/${timestamp}_cover.png`;

    console.log(`Uploading ${filename} for ${listing.title} (${listing.id})...`);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(destination, fileBuffer, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      console.error(`Failed to upload for ${listing.title}:`, uploadError);
    } else {
      console.log(`Success: ${destination}`);
    }
  }

  console.log('Done uploading images!');
}

run();

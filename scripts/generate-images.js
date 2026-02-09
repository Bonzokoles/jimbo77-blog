/**
 * generate-images.js
 * Generates dark sci-fi images for GEO blog articles via Replicate API
 * 
 * Usage: node scripts/generate-images.js
 * 
 * Requirements:
 * - REPLICATE_API_TOKEN in parent .env (ai-social-club/project/.env)
 * - R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY for upload
 */

import Replicate from 'replicate';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env from parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Validate environment
if (!process.env.REPLICATE_API_TOKEN) {
  console.error('❌ REPLICATE_API_TOKEN not found in .env');
  process.exit(1);
}

if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_ENDPOINT) {
  console.error('❌ R2 credentials missing in .env');
  process.exit(1);
}

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Initialize R2 client (S3-compatible)
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const R2_BUCKET = 'mybonzo-media';
const R2_PREFIX = 'blog-images/';

// Image prompts for 4 GEO articles (dark sci-fi style)
const IMAGE_CONFIGS = [
  {
    filename: 'geo_ai_crawlers_dark.jpg',
    prompt: 'Dark sci-fi scene: AI crawlers as glowing digital spiders scanning holographic web pages in a cyberpunk data center, neon blue and purple lighting, futuristic terminals, code streams floating in air, cinematic photography, moody atmosphere, --ar 16:9 --style raw',
    article: 'jak-ai-boty-czytaja-strony-geo'
  },
  {
    filename: 'llmstxt_guide_dark.jpg',
    prompt: 'Dark sci-fi library: Holographic markdown text file hovering above a technical workspace, AI bot silhouettes reading documents, glowing llms.txt protocol symbols, dark metallic textures, cyan and purple accents, technical blueprint aesthetics, --ar 16:9 --style raw',
    article: 'llms-txt-przewodnik-dla-ai-crawlerow'
  },
  {
    filename: 'bot_tracking_dark.jpg',
    prompt: 'Dark sci-fi analytics dashboard: Dark command center with surveillance screens showing bot traffic logs, glowing charts and SQL queries hovering in 3D space, User-Agent fingerprints as digital signatures, dark blue tech noir atmosphere, cinematic depth of field, --ar 16:9 --style raw',
    article: 'jak-sledzic-ai-boty-strategia-geo'
  },
  {
    filename: 'bot_reputation_dark.jpg',
    prompt: 'Dark sci-fi scoring system: AI bots ranked in glowing tier lists (S/A/B/C/D) on holographic displays, reputation scores as floating numbers with star ratings, dark futuristic courtroom or evaluation chamber, purple and gold lighting, professional photography, --ar 16:9 --style raw',
    article: 'ai-bot-reputation-score-system'
  }
];

/**
 * Generate image via Replicate SDXL model
 */
async function generateImage(config) {
  console.log(`\n📷 Generating: ${config.filename}`);
  console.log(`   Prompt: ${config.prompt.substring(0, 80)}...`);
  
  try {
    const output = await replicate.run(
      'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      {
        input: {
          prompt: config.prompt,
          negative_prompt: 'cartoon, anime, illustration, bright colors, cheerful, cute, comic style, sketch, watercolor, painting, amateur photography, blur, low quality',
          width: 1216,
          height: 832,
          num_outputs: 1,
          scheduler: 'DPMSolverMultistep',
          num_inference_steps: 50,
          guidance_scale: 7.5,
        }
      }
    );
    
    if (!output || !output[0]) {
      throw new Error('No output from Replicate');
    }
    
    const imageUrl = output[0];
    console.log(`   ✅ Image generated: ${imageUrl}`);
    return imageUrl;
    
  } catch (error) {
    console.error(`   ❌ Generation failed:`, error.message);
    throw error;
  }
}

/**
 * Download image from URL to buffer
 */
async function downloadImage(url) {
  console.log(`   ⬇️ Downloading...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Upload image to R2 bucket
 */
async function uploadToR2(buffer, filename) {
  console.log(`   ☁️ Uploading to R2: ${R2_BUCKET}/${R2_PREFIX}${filename}`);
  
  try {
    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: `${R2_PREFIX}${filename}`,
      Body: buffer,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000', // 1 year cache
    }));
    
    const publicUrl = `https://r2-public-mybonzo.stolarnia-ams.workers.dev/blog-images/${filename}`;
    console.log(`   ✅ Uploaded: ${publicUrl}`);
    return publicUrl;
    
  } catch (error) {
    console.error(`   ❌ Upload failed:`, error.message);
    throw error;
  }
}

/**
 * Save image locally (backup)
 */
async function saveLocally(buffer, filename) {
  const outputDir = path.join(__dirname, '../public/generated-images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`   💾 Saved locally: ${filepath}`);
}

/**
 * Process single image config
 */
async function processImage(config) {
  try {
    // 1. Generate via Replicate
    const imageUrl = await generateImage(config);
    
    // 2. Download
    const buffer = await downloadImage(imageUrl);
    
    // 3. Upload to R2
    const publicUrl = await uploadToR2(buffer, config.filename);
    
    // 4. Save locally (backup)
    await saveLocally(buffer, config.filename);
    
    console.log(`✅ SUCCESS: ${config.filename} → ${publicUrl}\n`);
    return { ...config, publicUrl, success: true };
    
  } catch (error) {
    console.error(`❌ FAILED: ${config.filename}`, error.message, '\n');
    return { ...config, error: error.message, success: false };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🎨 Jimbo77 Blog - Dark Sci-Fi Image Generator\n');
  console.log(`📦 Model: stability-ai/sdxl`);
  console.log(`🎯 Style: Dark sci-fi, cinematic, moody, technical`);
  console.log(`📁 Output: R2 bucket '${R2_BUCKET}/${R2_PREFIX}'`);
  console.log(`🖼️ Images to generate: ${IMAGE_CONFIGS.length}\n`);
  console.log('─'.repeat(80));
  
  const results = [];
  
  // Process images sequentially (Replicate rate limits)
  for (const config of IMAGE_CONFIGS) {
    const result = await processImage(config);
    results.push(result);
    
    // Rate limit: wait 5s between requests
    if (IMAGE_CONFIGS.indexOf(config) < IMAGE_CONFIGS.length - 1) {
      console.log('⏳ Waiting 5s before next generation...\n');
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  
  // Summary
  console.log('─'.repeat(80));
  console.log('\n📊 GENERATION SUMMARY\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  if (successful.length > 0) {
    successful.forEach(r => {
      console.log(`   • ${r.filename} → ${r.publicUrl}`);
    });
  }
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}/${results.length}`);
    failed.forEach(r => {
      console.log(`   • ${r.filename}: ${r.error}`);
    });
  }
  
  console.log('\n✨ Done! Next steps:');
  console.log('   1. Verify images in R2 worker: https://r2-public-mybonzo.stolarnia-ams.workers.dev/blog-images/');
  console.log('   2. Test blog post images in dev: npm run dev');
  console.log('   3. If satisfied, deploy: git push + vercel deploy\n');
  
  process.exit(failed.length > 0 ? 1 : 0);
}

// Execute
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

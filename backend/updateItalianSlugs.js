import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './models/Blog.js';

dotenv.config();

const MONGODB_URI = process.env.VITE_MONGODB_URI;

// Mapping of English slugs to Italian slugs (with CORRECT spelling)
const slugMapping = {
  'why-real-time-tracking-matters': 'perche-il-tracciamento-in-tempo-reale-e-importante',
  'top-5-shipping-mistakes-online-sellers': 'i-5-errori-di-spedizione-dei-venditori-online',
  'how-to-read-tracking-status': 'come-leggere-stato-tracciamento',
  'why-is-my-package-stuck-in-customs': 'perche-il-mio-pacco-e-bloccato-in-dogana',
  'fedex-vs-ups-vs-dhl-vs-usps-comparison': 'fedex-vs-ups-vs-dhl-vs-usps-quale-corriere-migliore',
  'how-to-track-international-package-guide': 'come-tracciare-pacco-internazionale-guida',
  'how-to-reduce-shipping-costs-tips': 'come-ridurre-costi-spedizione-consigli'
};

async function updateItalianSlugs() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let updatedCount = 0;

    for (const [englishSlug, italianSlug] of Object.entries(slugMapping)) {
      const result = await Blog.updateOne(
        { slug: englishSlug },
        { $set: { slugIt: italianSlug } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated "${englishSlug}" → "${italianSlug}"`);
        updatedCount++;
      } else {
        // Try to update by slugIt in case it already exists with wrong value
        const fixResult = await Blog.updateOne(
          { slugIt: { $regex: englishSlug.replace(/-/g, '.*') } },
          { $set: { slugIt: italianSlug } }
        );
        if (fixResult.modifiedCount > 0) {
          console.log(`✅ Fixed slug for "${englishSlug}" → "${italianSlug}"`);
          updatedCount++;
        } else {
          console.log(`⚠️ No post found with slug: "${englishSlug}"`);
        }
      }
    }

    console.log(`\n✅ Total updated: ${updatedCount} posts`);
    console.log('🎉 All Italian slugs have been fixed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateItalianSlugs();
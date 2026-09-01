import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.VITE_MONGODB_URI;

// Define the Blog schema directly in the script
const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  slugIt: String,
  titleIt: String,
  bodyContent: String,
  bodyContentIt: String,
  shortSummary: String,
  shortSummaryIt: String,
  seoTitle: String,
  seoTitleIt: String,
  seoDescription: String,
  seoDescriptionIt: String,
  category: String,
  status: String,
  publishDate: String,
  author: String,
  readTime: String,
  featuredImage: String,
  targetKeywords: String,
  createdAt: Date,
  updatedAt: Date
});

const Blog = mongoose.model('Blog', BlogSchema);

// Complete mapping of ALL blog slugs
const slugMapping = {
  'why-real-time-tracking-matters': 'perche-il-tracciamento-in-tempo-reale-e-importante',
  'top-5-shipping-mistakes-online-sellers': 'i-5-errori-di-spedizione-dei-venditori-online',
  'how-to-read-tracking-status': 'come-leggere-stato-tracciamento',
  'why-is-my-package-stuck-in-customs': 'perche-il-mio-pacco-e-bloccato-in-dogana',
  'fedex-vs-ups-vs-dhl-vs-usps-comparison': 'fedex-vs-ups-vs-dhl-vs-usps-quale-corriere-migliore',
  'how-to-track-international-package-guide': 'come-tracciare-pacco-internazionale-guida',
  'how-to-reduce-shipping-costs-tips': 'come-ridurre-costi-spedizione-consigli'
};

async function fixAllSlugs() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    const allBlogs = await Blog.find({});
    console.log(`📊 Found ${allBlogs.length} blogs\n`);

    let updated = 0;
    let skipped = 0;

    for (const blog of allBlogs) {
      const englishSlug = blog.slug;
      const italianSlug = slugMapping[englishSlug];
      
      if (!italianSlug) {
        console.log(`⚠️ No mapping found for: ${englishSlug}`);
        skipped++;
        continue;
      }

      if (blog.slugIt === italianSlug) {
        console.log(`✅ Already correct: ${blog.title} → ${italianSlug}`);
        skipped++;
        continue;
      }

      blog.slugIt = italianSlug;
      await blog.save();
      console.log(`🔧 Fixed: ${blog.title} → ${italianSlug}`);
      updated++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated: ${updated} blogs`);
    console.log(`   ⏭️ Skipped: ${skipped} blogs`);
    console.log(`   🎉 All done!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAllSlugs();
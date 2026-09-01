import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './models/Blog.js';
import Category from './models/Category.js';

dotenv.config();

const MONGODB_URI = process.env.VITE_MONGODB_URI;

async function updateCategoryCounts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all categories
    const categories = await Category.find();
    console.log(`📊 Found ${categories.length} categories`);

    // Update each category with post count
    for (const category of categories) {
      const count = await Blog.countDocuments({
        category: category.name,
        status: 'Published'
      });
      
      await Category.updateOne(
        { _id: category._id },
        { $set: { postCount: count } }
      );
      
      console.log(`📊 Updated "${category.name}" → ${count} posts`);
    }

    console.log('✅ All category counts updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateCategoryCounts();
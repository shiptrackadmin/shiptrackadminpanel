import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  // ========== ENGLISH VERSION (Required) ==========
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    default: 'Untitled'
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  bodyContent: {
    type: String,
    required: [true, 'Body content is required'],
    default: '<p></p>'
  },
  shortSummary: {
    type: String,
    default: ''
  },
  seoTitle: {
    type: String,
    default: ''
  },
  seoDescription: {
    type: String,
    default: ''
  },
  
  // ========== ITALIAN VERSION (Optional) ==========
  titleIt: {
    type: String,
    default: '',
    trim: true
  },
  slugIt: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  bodyContentIt: {
    type: String,
    default: ''
  },
  shortSummaryIt: {
    type: String,
    default: ''
  },
  seoTitleIt: {
    type: String,
    default: ''
  },
  seoDescriptionIt: {
    type: String,
    default: ''
  },
  
  // ========== COMMON FIELDS ==========
  category: {
    type: String,
    required: [true, 'Category is required'],
    default: 'Uncategorized'
  },
  status: {
    type: String,
    enum: ['Published', 'Draft'],
    default: 'Draft'
  },
  publishDate: {
    type: String,
    required: [true, 'Publish date is required'],
    default: () => new Date().toISOString().split('T')[0]
  },
  author: {
    type: String,
    default: 'Admin'
  },
  readTime: {
    type: String,
    default: '5 minutes'
  },
  featuredImage: {
    type: String,
    default: ''
  },
  targetKeywords: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
BlogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Allow multiple empty slugIt values, but require uniqueness when a slug is provided
BlogSchema.index(
  { slugIt: 1 }, 
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { slugIt: { $type: 'string', $ne: '' } } 
  }
);

// ========== AUTO-UPDATE CATEGORY POST COUNTS ==========

// After a blog is saved, update category post count
BlogSchema.post('save', async function(doc) {
  try {
    const Category = mongoose.model('Category');
    const count = await mongoose.model('Blog').countDocuments({ 
      category: doc.category, 
      status: 'Published' 
    });
    await Category.findOneAndUpdate(
      { name: doc.category },
      { 
        postCount: count,
        createdDate: new Date().toISOString().split('T')[0]
      },
      { upsert: true, new: true }
    );
    console.log(`📊 Updated category "${doc.category}" post count to ${count}`);
  } catch (error) {
    console.error('Error updating category count:', error);
  }
});

// After a blog is deleted, update category post count
BlogSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      const Category = mongoose.model('Category');
      const count = await mongoose.model('Blog').countDocuments({ 
        category: doc.category, 
        status: 'Published' 
      });
      await Category.findOneAndUpdate(
        { name: doc.category },
        { 
          postCount: count,
          createdDate: new Date().toISOString().split('T')[0]
        },
        { upsert: true, new: true }
      );
      console.log(`📊 Updated category "${doc.category}" post count to ${count}`);
    } catch (error) {
      console.error('Error updating category count after delete:', error);
    }
  }
});

// After a blog is updated (status change), update category post count
BlogSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    try {
      const Category = mongoose.model('Category');
      const count = await mongoose.model('Blog').countDocuments({ 
        category: doc.category, 
        status: 'Published' 
      });
      await Category.findOneAndUpdate(
        { name: doc.category },
        { 
          postCount: count,
          createdDate: new Date().toISOString().split('T')[0]
        },
        { upsert: true, new: true }
      );
      console.log(`📊 Updated category "${doc.category}" post count to ${count}`);
    } catch (error) {
      console.error('Error updating category count after update:', error);
    }
  }
});

const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;
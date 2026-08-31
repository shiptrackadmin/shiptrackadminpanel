import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  // ========== ENGLISH VERSION (Required) ==========
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  bodyContent: {
    type: String,
    required: true
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
    required: true
  },
  status: {
    type: String,
    enum: ['Published', 'Draft'],
    default: 'Draft'
  },
  publishDate: {
    type: String,
    required: true
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

// Allow slugIt to be empty but unique when provided
BlogSchema.index({ slugIt: 1 }, { unique: true, sparse: true });

const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;
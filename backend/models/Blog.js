import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
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
  shortSummary: {
    type: String,
    default: ''
  },
  bodyContent: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    default: ''
  },
  targetKeywords: {
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

const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  postCount: {
    type: Number,
    default: 0
  },
  createdDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
import express from 'express';
import Blog from '../models/Blog.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a single blog by slug (English OR Italian)
router.get('/:slug', async (req, res) => {
  try {
    let blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      blog = await Blog.findOne({ slugIt: req.params.slug });
    }
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a blog by Italian slug (backward compatibility)
router.get('/it/:slugIt', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slugIt: req.params.slugIt });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create a new blog
router.post('/', async (req, res) => {
  try {
    console.log('📥 Received body:', JSON.stringify(req.body, null, 2));

    // Build the blog data with proper fallbacks
    const blogData = {
      // English
      title: req.body.title || 'Untitled',
      slug: req.body.slug || `post-${Date.now()}`,
      bodyContent: req.body.bodyContent || '<p></p>',
      shortSummary: req.body.shortSummary || '',
      seoTitle: req.body.seoTitle || req.body.title || 'Untitled',
      seoDescription: req.body.seoDescription || '',
      // Italian
      titleIt: req.body.titleIt || '',
      slugIt: req.body.slugIt || '',
      bodyContentIt: req.body.bodyContentIt || '',
      shortSummaryIt: req.body.shortSummaryIt || '',
      seoTitleIt: req.body.seoTitleIt || '',
      seoDescriptionIt: req.body.seoDescriptionIt || '',
      // Common
      category: req.body.category || 'Uncategorized',
      status: req.body.status || 'Draft',
      publishDate: req.body.publishDate || new Date().toISOString().split('T')[0],
      author: req.body.author || 'Admin',
      readTime: req.body.readTime || '5 minutes',
      featuredImage: req.body.featuredImage || '',
      targetKeywords: req.body.targetKeywords || ''
    };

    console.log('📤 Saving blog data:', JSON.stringify(blogData, null, 2));

    const blog = new Blog(blogData);
    await blog.save();

    console.log('✅ Saved blog:', {
      id: blog._id,
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      titleIt: blog.titleIt,
      slugIt: blog.slugIt
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error('❌ Error saving blog:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT update a blog
router.put('/:id', async (req, res) => {
  try {
    console.log('📥 Received PUT body:', JSON.stringify(req.body, null, 2));

    // Ensure required fields exist
    const updateData = {
      ...req.body,
      category: req.body.category || 'Uncategorized',
      slug: req.body.slug || `post-${Date.now()}`
    };

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    console.log('✅ Updated blog:', { id: blog._id, title: blog.title });
    res.json(blog);
  } catch (error) {
    console.error('❌ Error updating blog:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE a blog
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Deleting blog with ID:', id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
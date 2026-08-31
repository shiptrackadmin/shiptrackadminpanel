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

// GET a single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a blog by Italian slug
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
    console.log('📥 Backend received body:', req.body);
    console.log('📥 Italian fields in backend:', {
      titleIt: req.body.titleIt,
      slugIt: req.body.slugIt,
      bodyContentIt: req.body.bodyContentIt ? req.body.bodyContentIt.substring(0, 50) + '...' : 'empty',
      shortSummaryIt: req.body.shortSummaryIt,
      seoTitleIt: req.body.seoTitleIt,
      seoDescriptionIt: req.body.seoDescriptionIt
    });
    
    const blog = new Blog(req.body);
    await blog.save();
    
    console.log('✅ Saved blog:', {
      id: blog._id,
      title: blog.title,
      titleIt: blog.titleIt,
      slugIt: blog.slugIt,
      hasBodyContentIt: !!blog.bodyContentIt,
      bodyContentItLength: blog.bodyContentIt ? blog.bodyContentIt.length : 0
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
    console.log('📥 Backend received PUT body:', req.body);
    console.log('📥 Italian fields in PUT:', {
      titleIt: req.body.titleIt,
      slugIt: req.body.slugIt,
      bodyContentIt: req.body.bodyContentIt ? req.body.bodyContentIt.substring(0, 50) + '...' : 'empty'
    });
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    console.log('✅ Updated blog:', {
      id: blog._id,
      title: blog.title,
      titleIt: blog.titleIt,
      hasBodyContentIt: !!blog.bodyContentIt
    });
    
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
```js
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
    // First try to find by English slug
    let blog = await Blog.findOne({ slug: req.params.slug });

    // If not found, try Italian slug
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
    console.log('📥 Backend received body:', req.body);

    // English fields are required.
    // Italian fields are completely optional.
    const blogData = { ...req.body };

    // Remove empty Italian fields.
    // This allows an English-only blog to be published
    // without requiring an Italian version.
    const italianFields = [
      'titleIt',
      'slugIt',
      'bodyContentIt',
      'shortSummaryIt',
      'seoTitleIt',
      'seoDescriptionIt'
    ];

    italianFields.forEach((field) => {
      if (
        blogData[field] === undefined ||
        blogData[field] === null ||
        (typeof blogData[field] === 'string' && blogData[field].trim() === '')
      ) {
        delete blogData[field];
      }
    });

    console.log('📥 Italian fields after optional-field cleanup:', {
      titleIt: blogData.titleIt || '(not provided)',
      slugIt: blogData.slugIt || '(not provided)',
      bodyContentIt: blogData.bodyContentIt
        ? blogData.bodyContentIt.substring(0, 50) + '...'
        : '(not provided)',
      shortSummaryIt: blogData.shortSummaryIt || '(not provided)',
      seoTitleIt: blogData.seoTitleIt || '(not provided)',
      seoDescriptionIt: blogData.seoDescriptionIt || '(not provided)'
    });

    const blog = new Blog(blogData);
    await blog.save();

    console.log('✅ Saved blog:', {
      id: blog._id,
      title: blog.title,
      titleIt: blog.titleIt || '(none)',
      slugIt: blog.slugIt || '(none)',
      hasBodyContentIt: !!blog.bodyContentIt,
      bodyContentItLength: blog.bodyContentIt
        ? blog.bodyContentIt.length
        : 0
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

    // English fields are required.
    // Italian fields are completely optional.
    const updateData = { ...req.body };

    // Remove empty Italian fields instead of validating them.
    const italianFields = [
      'titleIt',
      'slugIt',
      'bodyContentIt',
      'shortSummaryIt',
      'seoTitleIt',
      'seoDescriptionIt'
    ];

    italianFields.forEach((field) => {
      if (
        updateData[field] === undefined ||
        updateData[field] === null ||
        (typeof updateData[field] === 'string' && updateData[field].trim() === '')
      ) {
        delete updateData[field];
      }
    });

    console.log('📥 Italian fields after optional-field cleanup:', {
      titleIt: updateData.titleIt || '(not provided)',
      slugIt: updateData.slugIt || '(not provided)',
      bodyContentIt: updateData.bodyContentIt
        ? updateData.bodyContentIt.substring(0, 50) + '...'
        : '(not provided)'
    });

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    console.log('✅ Updated blog:', {
      id: blog._id,
      title: blog.title,
      titleIt: blog.titleIt || '(none)',
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
```

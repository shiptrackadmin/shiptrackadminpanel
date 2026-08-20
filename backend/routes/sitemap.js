import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

// Generate sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://shiptrack.com';
    
    // Get all published blogs
    const blogs = await Blog.find({ status: 'Published' }).sort({ publishDate: -1 });
    
    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Add home page
    sitemap += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
    
    // Add blog page
    sitemap += `
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    
    // Add each blog post
    blogs.forEach(blog => {
      const date = blog.publishDate || blog.createdAt || new Date().toISOString().split('T')[0];
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    
    // Add static pages
    const staticPages = ['about', 'contact', 'privacy', 'faq'];
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}/${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
    });
    
    sitemap += `
</urlset>`;
    
    // Send response as XML
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
    
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
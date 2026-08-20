import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  sitemapUrl: {
    type: String,
    default: 'https://shiptrack.com/sitemap.xml'
  },
  sitemapLastGenerated: {
    type: String,
    default: ''
  },
  robotsTxt: {
    type: String,
    default: `User-agent: *
Allow: /
Allow: /blog/
Allow: /tracking/
Disallow: /admin/
Disallow: /api/private/
Sitemap: https://shiptrack.com/sitemap.xml`
  },
  robotsLastUpdated: {
    type: String,
    default: ''
  },
  metaTitleSuffix: {
    type: String,
    default: '| ShipTrack Parcel Intelligence'
  },
  canonicalEnabled: {
    type: Boolean,
    default: true
  },
  globalMetaDescription: {
    type: String,
    default: 'ShipTrack CMS powers official blog updates, logistics guides, customs advice, and package tracking knowledge for international shippers.'
  }
});

const Settings = mongoose.model('Settings', SettingsSchema);
export default Settings;
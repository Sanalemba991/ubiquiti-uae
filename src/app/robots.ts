import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/*.json$'],
    },
    sitemap: 'https://ubiquiti-uae.com/sitemap.xml',
    host: 'https://ubiquiti-uae.com',
  };
}

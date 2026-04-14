import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/settings/'],
    },
    sitemap: 'https://www.vicevault.vercel.app/sitemap.xml',
  }
}

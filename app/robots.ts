import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/'],
                disallow: ['/login', '/dashboard', '/transactions', '/reports', '/settings', '/api/'],
            },
        ],
        sitemap: `${SEO_CONFIG.baseUrl}/sitemap.xml`,
    };
}

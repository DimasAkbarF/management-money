import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: SEO_CONFIG.baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 1,
        },
    ];
}

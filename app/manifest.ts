import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SEO_CONFIG.name,
        short_name: 'FinanceOS',
        description: SEO_CONFIG.description,
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0F172A',
        theme_color: SEO_CONFIG.themeColor,
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    };
}

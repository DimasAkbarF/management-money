import { Metadata, Viewport } from 'next';

export const SEO_CONFIG = {
    name: 'FinanceOS',
    author: 'Dimas',
    baseUrl: 'https://finance-management-money.vercel.app',
    description: 'FinanceOS — Personal Finance Management for technical professionals. Manage assets, track budgets, and audit transactions with a premium glassmorphic interface.',
    defaultTitle: 'FinanceOS — Professional Financial Analytics Portal',
    titleTemplate: '%s | FinanceOS Finance Management',
    twitterHandle: '@financeos',
    themeColor: '#2563EB',
};

export function generateCanonical(path: string = ''): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${SEO_CONFIG.baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
}

export function generateOpenGraph({
    title,
    description,
    path,
    image,
}: {
    title: string;
    description: string;
    path: string;
    image: string;
}) {
    return {
        type: 'website',
        locale: 'id_ID',
        url: generateCanonical(path),
        siteName: SEO_CONFIG.name,
        title,
        description,
        images: [
            {
                url: image,
                width: 1200,
                height: 630,
                alt: `${SEO_CONFIG.name} Preview`,
            },
        ],
    };
}

export function generateTwitterCard({
    title,
    description,
    image,
}: {
    title: string;
    description: string;
    image: string;
}) {
    return {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
        creator: SEO_CONFIG.twitterHandle,
    };
}

export function generateViewport(): Viewport {
    return {
        themeColor: SEO_CONFIG.themeColor,
        width: 'device-width',
        initialScale: 1,
        maximumScale: 5,
        viewportFit: 'cover',
    };
}

export function generateMetadata({
    title = SEO_CONFIG.defaultTitle,
    description = SEO_CONFIG.description,
    image = '/og-image.png',
    noIndex = false,
    path = '',
}: {
    title?: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
    path?: string;
} = {}): Metadata {
    const canonicalUrl = generateCanonical(path);

    return {
        title: {
            default: title,
            template: SEO_CONFIG.titleTemplate,
        },
        description,
        keywords: [
            'personal finance', 'expense tracker', 'budget management',
            'financial audit', 'asset management', 'finance dashboard',
            'next.js finance app', 'professional finance tool'
        ],
        authors: [{ name: SEO_CONFIG.author }],
        creator: SEO_CONFIG.author,
        publisher: SEO_CONFIG.name,
        metadataBase: new URL(SEO_CONFIG.baseUrl),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: generateOpenGraph({ title, description, path, image }),
        twitter: generateTwitterCard({ title, description, image }),
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        icons: {
            icon: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },
        appleWebApp: {
            capable: true,
            statusBarStyle: 'default',
            title: SEO_CONFIG.name,
        },
        manifest: '/manifest.json',
    };
}

// Keep constructMetadata for backward compatibility during refactor
export const constructMetadata = generateMetadata;
export const getCanonicalUrl = generateCanonical;


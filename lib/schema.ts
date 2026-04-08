import { SEO_CONFIG } from './seo';

export function getOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SEO_CONFIG.name,
        url: SEO_CONFIG.baseUrl,
        logo: `${SEO_CONFIG.baseUrl}/favicon.ico`,
        sameAs: [
            'https://twitter.com/financeos',
            'https://github.com/dimas/financeos',
        ],
    };
}

export function getWebApplicationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SEO_CONFIG.name,
        url: SEO_CONFIG.baseUrl,
        description: SEO_CONFIG.description,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        author: {
            '@type': 'Person',
            name: SEO_CONFIG.author,
        },
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
    };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SEO_CONFIG.baseUrl}${item.item}`,
        })),
    };
}

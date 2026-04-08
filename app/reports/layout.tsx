import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
    title: 'Financial Reports',
    noIndex: true,
    path: '/reports',
});

export default function ReportsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

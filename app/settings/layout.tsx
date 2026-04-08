import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
    title: 'Portal Settings',
    noIndex: true,
    path: '/settings',
});

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

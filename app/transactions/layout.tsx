import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
    title: 'Transaction Ledger',
    noIndex: true,
    path: '/transactions',
});

export default function TransactionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

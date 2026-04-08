import AppLayout from '@/components/layout/AppLayout';

export default function Loading() {
    return (
        <AppLayout username="dimas">
            <div className="space-y-6 animate-pulse">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-muted rounded-xl" />
                    <div className="h-4 w-64 bg-muted rounded-lg" />
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 h-40 w-full" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-3xl h-40 w-full" />
                    <div className="bg-card border border-border rounded-3xl h-40 w-full" />
                </div>

                <div className="bg-card border border-border rounded-3xl h-24 w-full" />
            </div>
        </AppLayout>
    );
}

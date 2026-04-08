import AppLayout from '@/components/layout/AppLayout';

export default function Loading() {
    return (
        <AppLayout username="dimas">
            <div className="space-y-6 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-muted rounded-xl" />
                        <div className="h-4 w-64 bg-muted rounded-lg" />
                    </div>
                    <div className="h-12 w-40 bg-muted rounded-xl" />
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 h-32 w-full" />

                <div className="bg-card border border-border rounded-2xl overflow-hidden h-96 w-full" />
            </div>
        </AppLayout>
    );
}

'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import DashboardCards from '@/components/DashboardCards';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, History, Edit3, Trash2, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Dark/blue themed skeleton for chart containers — exact dimensions prevent CLS
function ChartSkeleton() {
    return (
        <div
            className="w-full rounded-[3rem] bg-black/40 border border-white/[0.05] overflow-hidden relative"
            style={{ height: '350px', contain: 'strict' }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/[0.04] to-transparent animate-[shimmer_2s_infinite]" />
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            </div>
        </div>
    );
}

// Code-split heavy chart bundles — SSR disabled since ApexCharts requires DOM
const RealtimeLineChart = dynamic(() => import('@/components/charts/RealtimeLineChart'), {
    ssr: false,
    loading: () => <ChartSkeleton />
});
const CategoryPieChart = dynamic(() => import('@/components/charts/CategoryPieChart'), {
    ssr: false,
    loading: () => <ChartSkeleton />
});

// Defer TransactionModal — not needed at first paint
const TransactionModal = dynamic(() => import('@/components/TransactionModal'), {
    ssr: false,
    loading: () => null
});

interface DashboardData {
    stats: {
        totalIncome: number;
        totalExpense: number;
        balance: number;
        dailyExpense: number;
        dailyLimit: number;
        budgetExceeded: boolean;
    };
    charts: {
        dailyExpense: { date: string; amount: number }[];
        categoryBreakdown: { name: string; value: number }[];
        monthlyData: { month: string; income: number; expense: number }[];
    };
    recentTransactions: any[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const router = useRouter();

    const now = new Date();
    const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Use SWR for optimized data fetching
    const { data, error, mutate, isLoading } = useSWR<DashboardData>(
        `/api/dashboard?today=${localToday}`,
        fetcher,
        {
            revalidateOnFocus: true,
            dedupingInterval: 5000,
        }
    );

    const handleDelete = useCallback(async (id: string) => {
        if (!confirm('Hapus transaksi ini?')) return;
        try {
            const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                mutate(); // Optimistic update or just revalidate
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Gagal menghapus: ${err.error || 'Terjadi kesalahan'}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    }, [mutate, router]);

    const handleEdit = useCallback((transaction: any) => {
        setEditData(transaction);
        setIsModalOpen(true);
    }, []);

    // Memoize chart data
    const dailyTrendData = useMemo(() => data?.charts?.dailyExpense || [], [data]);
    const categoryData = useMemo(() => data?.charts?.categoryBreakdown || [], [data]);

    return (
        <AppLayout username="dimas">
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#3B82F6] text-[10px] uppercase tracking-[0.4em] font-black italic mb-1">
                            <Sparkles className="w-4 h-4" aria-hidden="true" /> FinanceOS Professional
                        </div>
                        <h1 className="text-text-heading">
                            System
                            <span className="text-[#3B82F6] italic">
                                Overview
                            </span>
                        </h1>
                        <p className="text-text-secondary-content text-sm font-medium italic text-balance">Lacak kesehatan finansial Anda secara real-time.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setEditData(null); setIsModalOpen(true); }}
                        className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#3B82F6] text-white px-8 py-4 text-sm font-black transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:bg-[#2563EB]"
                        aria-label="Tambah transaksi baru"
                    >
                        <Plus className="w-5 h-5" aria-hidden="true" /> Tambah Transaksi
                    </motion.button>
                </div>

                {/* Performance Optimized Stats Grid */}
                <DashboardCards
                    totalIncome={data?.stats?.totalIncome || 0}
                    totalExpense={data?.stats?.totalExpense || 0}
                    balance={data?.stats?.balance || 0}
                    dailyExpense={data?.stats?.dailyExpense || 0}
                    dailyLimit={data?.stats?.dailyLimit || 0}
                    loading={isLoading}
                />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Charts */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Daily Trend Chart Card */}
                        <div
                            className="glass-morphism rounded-[3rem] p-10 border border-white/[0.08] premium-shadow overflow-hidden group relative hardware-accelerated"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-text-heading tracking-tighter">Expenditure Flow</h2>
                                    <p className="text-[10px] text-text-muted-content font-black uppercase tracking-[0.3em] mt-2 italic">7-Day Transaction Velocity</p>
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 shadow-glow">
                                    Encrypted Live
                                </div>
                            </div>
                            <div
                                className="w-full chart-container"
                                style={{ contain: 'strict', overflow: 'hidden', height: '350px', width: '100%', contentVisibility: 'auto' }}
                                role="img"
                                aria-label="7-Day Transaction Velocity Chart"
                            >
                                <Suspense fallback={<ChartSkeleton />}>
                                    <RealtimeLineChart data={dailyTrendData} />
                                </Suspense>
                            </div>
                        </div>

                        {/* Recent Transactions List */}
                        <div className="glass-morphism rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-black text-text-heading tracking-tight">Transaksi Terbaru</h2>
                                    <p className="text-xs text-text-muted-content font-bold uppercase tracking-widest mt-1">Riwayat Penggunaan Terakhir</p>
                                </div>
                                <Link href="/transactions" className="p-2 px-4 rounded-xl bg-black/[0.05] dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-text-secondary-content hover:text-text-heading text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2" aria-label="Lihat semua transaksi">
                                    Lihat Semua <History className="w-4 h-4" aria-hidden="true" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                <AnimatePresence mode='popLayout'>
                                    {isLoading ? (
                                        [...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="skeleton w-12 h-12 rounded-xl" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="skeleton h-4 w-40 rounded-lg" />
                                                    <div className="skeleton h-3 w-24 rounded-lg" />
                                                </div>
                                                <div className="skeleton h-5 w-24 rounded-lg" />
                                            </div>
                                        ))
                                    ) : (
                                        data?.recentTransactions?.map((t, idx) => (
                                            <motion.div
                                                key={t._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                                            >
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 shadow-lg",
                                                    t.type === 'income'
                                                        ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/20"
                                                        : "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/20"
                                                )}>
                                                    {t.type === 'income' ? <ArrowUpRight className="w-6 h-6" aria-hidden="true" /> : <ArrowDownRight className="w-6 h-6" aria-hidden="true" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base font-black text-text-primary-content truncate leading-tight">{t.description}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-text-secondary-content font-bold uppercase tracking-widest">{t.category}</span>
                                                        <span className="w-1 h-1 rounded-full bg-text-muted-content/30" />
                                                        <span className="text-[10px] text-text-muted-content font-medium">{formatDate(t.date)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 text-right">
                                                    <p className={cn(
                                                        "text-lg font-black tabular-nums tracking-tighter",
                                                        t.type === 'income' ? "text-[#10B981]" : "text-[#EF4444]"
                                                    )}>
                                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                                    </p>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                                        <button
                                                            onClick={() => handleEdit(t)}
                                                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-text-muted-content hover:text-text-heading transition-all hover:bg-slate-200 dark:hover:bg-white/10"
                                                            aria-label={`Edit transaksi ${t.description}`}
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(t._id)}
                                                            className="p-1.5 rounded-lg bg-white/5 text-[#EF4444]/40 hover:text-[#EF4444] transition-all hover:bg-[#EF4444]/10"
                                                            aria-label={`Hapus transaksi ${t.description}`}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>

                                {!isLoading && (!data || data?.recentTransactions?.length === 0) && (
                                    <div className="h-40 flex flex-col items-center justify-center text-text-muted-content">
                                        <History className="w-12 h-12 mb-3 opacity-30" aria-hidden="true" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Belum ada aktivitas transaksi</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Breakdown */}
                    <div className="lg:col-span-4 space-y-8">
                        <div
                            className="glass-morphism rounded-[3rem] p-10 border border-white/[0.08] premium-shadow h-full relative overflow-hidden hardware-accelerated"
                        >
                            <h2 className="text-2xl font-black text-text-heading tracking-tighter mb-10">Asset Allocation</h2>
                            <div
                                className="w-full chart-container"
                                style={{ contain: 'strict', overflow: 'hidden', height: '350px', width: '100%', contentVisibility: 'auto' }}
                                role="img"
                                aria-label="Expense Category Allocation Chart"
                            >
                                <Suspense fallback={<ChartSkeleton />}>
                                    <CategoryPieChart data={categoryData} />
                                </Suspense>
                            </div>

                            <div className="mt-10 space-y-4">
                                {categoryData.slice(0, 4).map((cat: any) => (
                                    <div key={cat.name} className="flex items-center justify-between p-4 rounded-3xl bg-black/[0.02] border border-black/[0.04] hover:border-black/10 transition-colors">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary-content">{cat.name}</span>
                                        <span className="text-base font-black text-text-heading tabular-nums tracking-tighter">{formatCurrency(cat.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditData(null); }}
                onSuccess={() => mutate()} // Optimized UI refresh
                editData={editData}
            />
        </AppLayout>
    );
}

'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import TransactionModal from '@/components/TransactionModal';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import {
    Search,
    Filter,
    Trash2,
    Edit3,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Calendar,
    Tag,
    Clock,
    History
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TransactionsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [dateFrom, setDateFrom] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const router = useRouter();

    // SWR for optimized fetching
    const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        search,
        category,
        type,
        dateFrom,
    });

    const { data, error, mutate, isLoading } = useSWR(
        `/api/transactions?${params}`,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 10000,
        }
    );

    const transactions = data?.transactions || [];
    const total = data?.total || 0;

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) return;
        try {
            const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                mutate();
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Gagal menghapus: ${err.error || 'Terjadi kesalahan'}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleEdit = (transaction: any) => {
        setEditData(transaction);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditData(null);
        setIsModalOpen(true);
    };

    return (
        <AppLayout username="dimas">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#2563EB] text-[10px] uppercase tracking-[0.4em] font-black italic mb-1">
                            <History className="w-4 h-4" /> Comprehensive Audit
                        </div>
                        <h1 className="text-text-heading">
                            Registry <span className="text-[#2563EB] italic">History</span>
                        </h1>
                        <p className="text-text-secondary-content text-sm font-medium italic">Kelola dan pantau setiap pergerakan dana Anda dengan detail algoritma presisi.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAdd}
                        className="inline-flex items-center justify-center gap-3 rounded-2xl gradient-primary px-8 py-4 text-sm font-black text-white shadow-xl hover:opacity-90 transition-all border border-white/10"
                        aria-label="Add new transaction"
                    >
                        <Plus className="w-5 h-5" aria-hidden="true" /> Tambah Transaksi
                    </motion.button>
                </div>

                {/* Advanced Filters */}
                <div className="glass-morphism rounded-[3rem] p-10 border border-white/[0.08] premium-shadow space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow">
                                <Filter className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl text-text-secondary-content dark:text-[#94A3B8] tracking-tighter">Advanced Filtering</h2>
                        </div>

                        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05]" role="group" aria-label="Quick time filters">
                            <button
                                onClick={() => setDateFrom('')}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    dateFrom === '' ? "gradient-primary text-white" : "text-text-muted-content hover:text-primary"
                                )}
                                aria-pressed={dateFrom === ''}
                            >
                                All Time
                            </button>
                            <button
                                onClick={() => {
                                    const now = new Date();
                                    setDateFrom(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
                                }}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    dateFrom === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` ? "gradient-primary text-white" : "text-text-muted-content hover:text-primary"
                                )}
                                aria-pressed={dateFrom !== ''}
                            >
                                Today
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted-content group-focus-within:text-primary transition-colors" aria-hidden="true" />
                            <input
                                type="text"
                                placeholder="Search description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8FAFC] dark:bg-black/20 border border-[#E2E8F0] dark:border-white/5 focus:border-primary/50 outline-none text-sm font-bold text-text-primary-content transition-all placeholder:text-text-muted-content"
                                aria-label="Search by description"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-white/20" aria-hidden="true" />
                            <select
                                value={type}
                                onChange={(e) => { setType(e.target.value); setCategory(''); }}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8FAFC] dark:bg-black/20 border border-[#E2E8F0] dark:border-white/5 focus:border-primary/50 outline-none text-sm font-bold text-text-primary-content appearance-none cursor-pointer"
                                aria-label="Filter by type"
                            >
                                <option value="" className="bg-[#FFFFFF] dark:bg-[#161B26]">All Types</option>
                                <option value="income" className="bg-[#FFFFFF] dark:bg-[#161B26]">Income</option>
                                <option value="expense" className="bg-[#FFFFFF] dark:bg-[#161B26]">Expense</option>
                            </select>
                        </div>

                        <div className="relative group">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted-content/50 dark:text-white/20 group-focus-within:text-primary transition-colors" aria-hidden="true" />
                            <input
                                type="text"
                                placeholder="Category..."
                                value={search}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8FAFC] dark:bg-black/20 border border-[#E2E8F0] dark:border-white/5 focus:border-primary/50 outline-none text-sm font-bold text-text-primary-content transition-all placeholder:text-text-muted-content"
                                aria-label="Filter by category"
                            />
                        </div>

                        <div className="relative h-[56px]">
                            <History className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted-content/50 dark:text-white/20 pointer-events-none" aria-hidden="true" />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full h-full pl-12 pr-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-black/20 border border-[#E2E8F0] dark:border-white/5 focus:border-primary/50 outline-none text-sm font-bold text-text-primary-content [appearance:none] [-webkit-appearance:none]"
                                aria-label="Select start date"
                            />
                        </div>
                    </div>
                </div>

                {/* Transactions Content */}
                <div className="glass-morphism rounded-[3rem] border border-black/5 dark:border-white/[0.08] premium-shadow overflow-hidden">
                    <div className="overflow-x-auto overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-black/5 dark:border-white/5">
                                    <th scope="col" className="px-8 py-6 text-[9px] font-black text-text-muted-content uppercase tracking-[0.2em]">Transaction Info</th>
                                    <th scope="col" className="px-8 py-6 text-[9px] font-black text-text-muted-content uppercase tracking-[0.2em]">Category</th>
                                    <th scope="col" className="px-8 py-6 text-[9px] font-black text-text-muted-content uppercase tracking-[0.2em] text-right">Amount</th>
                                    <th scope="col" className="px-8 py-6 text-[9px] font-black text-text-muted-content uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                <AnimatePresence mode='popLayout'>
                                    {isLoading ? (
                                        [...Array(8)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="px-8 py-6"><div className="skeleton h-10 w-64 rounded-xl" /></td>
                                                <td className="px-8 py-6"><div className="skeleton h-6 w-24 rounded-lg" /></td>
                                                <td className="px-8 py-6 text-right"><div className="skeleton h-8 w-32 rounded-xl ml-auto" /></td>
                                                <td className="px-8 py-6 text-right"><div className="skeleton h-8 w-16 rounded-xl ml-auto" /></td>
                                            </tr>
                                        ))
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center gap-4 text-text-muted-content">
                                                    <History className="w-16 h-16 opacity-40" />
                                                    <p className="text-xs font-black uppercase tracking-[0.3em] italic">Data transaksi tidak ditemukan</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((t: any, idx: number) => (
                                            <motion.tr
                                                key={t._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
                                                            t.type === 'income' ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"
                                                        )}>
                                                            {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-base font-black text-text-primary-content leading-tight">{t.description}</p>
                                                            <p className="text-[10px] text-text-muted-content font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                                                <Clock className="w-3 h-3" /> {formatDate(t.date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={cn(
                                                        "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border",
                                                        t.type === 'income'
                                                            ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                                                            : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                                                    )}>
                                                        {t.category}
                                                    </span>
                                                </td>
                                                <td className={cn(
                                                    "px-8 py-6 text-xl font-black text-right tabular-nums tracking-tighter",
                                                    t.type === 'income' ? "text-[#10B981]" : "text-[#EF4444]"
                                                )}>
                                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button
                                                            onClick={() => handleEdit(t)}
                                                            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-black/10 dark:hover:bg-white/10"
                                                            title="Edit"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(t._id)}
                                                            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-[#EF4444]/60 dark:text-[#EF4444]/40 hover:text-[#EF4444] transition-all hover:bg-[#EF4444]/10"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Sophisticated Pagination */}
                    <div className="px-10 py-10 border-t border-black/5 dark:border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-8 bg-black/[0.01] dark:bg-white/[0.01]">
                        <p className="text-[10px] font-black text-text-muted-content uppercase tracking-[0.4em] italic">
                            Displaying <span className="text-text-heading">{Math.min(transactions.length, 15)}</span> of <span className="text-text-heading">{total}</span> System Records
                        </p>

                        <div className="flex items-center gap-6" role="navigation" aria-label="Pagination">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -2 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="p-4 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.05] hover:bg-black/10 dark:hover:bg-white/[0.08] disabled:opacity-20 disabled:hover:bg-transparent transition-all text-black/60 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
                                aria-label="Go to previous page"
                            >
                                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
                            </motion.button>

                            <div className="px-8 py-4 rounded-3xl bg-primary/10 border border-primary/20 text-xs font-black text-primary min-w-[120px] text-center uppercase tracking-[0.3em] shadow-glow" aria-current="page">
                                Page {page}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1, x: 2 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={transactions.length < 15 || page * 15 >= total}
                                onClick={() => setPage(page + 1)}
                                className="p-4 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.05] hover:bg-black/10 dark:hover:bg-white/[0.08] disabled:opacity-20 disabled:hover:bg-transparent transition-all text-black/60 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
                                aria-label="Go to next page"
                            >
                                <ChevronRight className="w-6 h-6" aria-hidden="true" />
                            </motion.button>
                        </div>
                    </div>
                </div>

                <TransactionModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEditData(null); }}
                    onSuccess={() => mutate()}
                    editData={editData}
                />
            </motion.div>
        </AppLayout>
    );
}

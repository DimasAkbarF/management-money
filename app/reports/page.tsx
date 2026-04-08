'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import {
    Calendar,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    Calculator,
    Database,
    Sparkles,
    Trash2
} from 'lucide-react';

export default function ReportsPage() {
    const [dateFrom, setDateFrom] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    });
    const [dateTo, setDateTo] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ dateFrom, dateTo });
            const res = await fetch(`/api/reports?${params}`);
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error('Fetch report error:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!data) return;
        const [jsPDF, autoTable] = await Promise.all([
            (await import('jspdf')).default,
            (await import('jspdf-autotable')).default
        ]);
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(59, 130, 246);
        doc.text('FinanceOS - Financial Report', 14, 22);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Period: ${formatDate(dateFrom)} - ${formatDate(dateTo)}`, 14, 30);
        doc.setDrawColor(230);
        doc.line(14, 40, 196, 40);
        const tableData = data.transactions.map((t: any) => [
            formatDate(t.date),
            t.description,
            t.category,
            t.type === 'income' ? 'INCOME' : 'EXPENSE',
            formatCurrency(t.amount)
        ]);
        autoTable(doc, {
            startY: 50,
            head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            columnStyles: { 4: { halign: 'right' } }
        });
        doc.save(`financeos-report-${dateFrom}.pdf`);
    };

    return (
        <AppLayout username="dimas">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10 pb-20"
            >
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-1 italic">
                        <Sparkles className="w-3.5 h-3.5" /> Intelligence Engine
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-text-heading">Financial <span className="text-primary italic">Analytics</span></h1>
                    <p className="text-text-secondary-content text-xs sm:text-sm font-medium italic">Analisis mendalam mengenai kesehatan finansial Anda dengan presisi algoritma tinggi.</p>
                </div>

                {/* Report Configuration */}
                <div className="glass-morphism rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 border border-black/5 dark:border-white/[0.08] premium-shadow space-y-8 sm:space-y-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow">
                                <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-text-heading tracking-tighter leading-none">Chronos Period</h2>
                                <p className="text-[10px] text-text-muted-content font-black uppercase tracking-[0.3em] mt-2 italic px-1">Tentukan rentang data audit laporan</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05]" role="group" aria-label="Report preset filters">
                            {['7 Days', 'Current Month', 'Last Month'].map((label, idx) => (
                                <button
                                    key={label}
                                    onClick={() => {
                                        const now = new Date();
                                        let start, end = now;
                                        if (idx === 0) {
                                            start = new Date(); start.setDate(now.getDate() - 7);
                                        } else if (idx === 1) {
                                            start = new Date(now.getFullYear(), now.getMonth(), 1);
                                            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                                        } else {
                                            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                                            end = new Date(now.getFullYear(), now.getMonth(), 0);
                                        }
                                        setDateFrom(start.toISOString().split('T')[0]);
                                        setDateTo(end.toISOString().split('T')[0]);
                                    }}
                                    className="flex-1 lg:flex-none px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-text-muted-content hover:bg-black/5 dark:hover:bg-white/10 hover:text-primary dark:hover:text-white transition-all whitespace-nowrap"
                                    aria-label={`Show data for ${label}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8 items-end">
                        <div className="space-y-3 min-w-0 w-full overflow-hidden">
                            <label className="text-[10px] font-black text-text-muted-content uppercase tracking-[0.2em] ml-2" htmlFor="dateFrom">Dari Tanggal</label>
                            <div className="relative group w-full overflow-hidden rounded-2xl">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted-content/40 group-focus-within:text-primary transition-colors pointer-events-none" aria-hidden="true" />
                                <input
                                    id="dateFrom"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full min-w-0 pl-14 pr-6 py-4 rounded-2xl bg-black/[0.02] dark:bg-black/20 border border-black/5 dark:border-white/5 focus:border-primary/50 outline-none text-sm font-bold text-text-primary-content transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-3 min-w-0 w-full overflow-hidden">
                            <label className="text-[10px] font-black text-text-muted-content uppercase tracking-[0.2em] ml-2" htmlFor="dateTo">Sampai Tanggal</label>
                            <div className="relative group w-full overflow-hidden rounded-2xl">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted-content/40 group-focus-within:text-primary transition-colors pointer-events-none" aria-hidden="true" />
                                <input
                                    id="dateTo"
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full min-w-0 pl-14 pr-6 py-4 rounded-2xl bg-black/[0.02] dark:bg-black/20 border border-black/5 dark:border-white/5 focus:border-primary/50 outline-none text-sm font-bold text-text-primary-content transition-all"
                                />
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={fetchReportData}
                            disabled={loading}
                            aria-disabled={loading}
                            className="w-full py-4 rounded-2xl gradient-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-label="Processing analysis..." />
                            ) : <Calculator className="w-5 h-5" aria-hidden="true" />}
                            Generate Analysis
                        </motion.button>
                    </div>
                </div>

                <AnimatePresence>
                    {data && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-10"
                        >
                            {/* Stats Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <div className="glass-morphism rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 border border-black/5 dark:border-white/[0.08] premium-shadow relative overflow-hidden group" role="region" aria-label="Revenue summary">
                                    <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
                                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#10B981] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
                                    </div>
                                    <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl group-hover:scale-110 transition-transform" aria-hidden="true">
                                            <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] sm:text-[10px] font-black text-text-muted-content uppercase tracking-[0.4em] mb-1 sm:mb-2 italic">Aggregated Revenue</p>
                                            <p className="text-2xl sm:text-4xl font-black text-text-heading tabular-nums tracking-tighter">
                                                {formatCurrency(data.summary.totalIncome)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="glass-morphism rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 border border-black/5 dark:border-white/[0.08] premium-shadow relative overflow-hidden group" role="region" aria-label="Spending summary">
                                    <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
                                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#EF4444] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
                                    </div>
                                    <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-2xl group-hover:scale-110 transition-transform" aria-hidden="true">
                                            <ArrowDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] sm:text-[10px] font-black text-text-muted-content uppercase tracking-[0.4em] mb-1 sm:mb-2 italic">Aggregated Spending</p>
                                            <p className="text-2xl sm:text-4xl font-black text-text-heading tabular-nums tracking-tighter">
                                                {formatCurrency(data.summary.totalExpense)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Export Action */}
                            <motion.button
                                whileHover={{ y: -8, scale: 1.01 }}
                                onClick={downloadPDF}
                                className="w-full glass-morphism rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 border border-black/5 dark:border-white/[0.1] premium-shadow hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all flex flex-col lg:flex-row items-center gap-8 sm:gap-12 group relative overflow-hidden"
                                aria-label="Download report as PDF"
                            >
                                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[2.5rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-glow group-hover:rotate-3 transition-transform" aria-hidden="true">
                                    <FileText className="w-10 h-10 sm:w-14 sm:h-14 text-primary" />
                                </div>
                                <div className="text-center lg:text-left flex-1 relative z-10">
                                    <h3 className="text-2xl sm:text-4xl font-black text-text-heading tracking-tighter mb-2 sm:mb-3">Export to Elite PDF</h3>
                                    <p className="text-text-secondary-content text-xs sm:text-base font-medium italic">Dokumen laporan resmi dengan analisis algoritma lengkap, siap untuk audit profesional.</p>
                                </div>
                                <div className="hidden lg:flex flex-col items-end gap-3 pr-6 relative z-10">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                                        <Database className="w-4 h-4" aria-hidden="true" /> Integrity Verified
                                    </div>
                                    <div className="px-5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/[0.03] text-[10px] font-black text-text-muted-content uppercase tracking-widest border border-black/[0.05] dark:border-white/[0.05]">
                                        {data.transactions.length} Records
                                    </div>
                                </div>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AppLayout>
    );
}

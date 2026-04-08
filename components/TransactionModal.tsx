'use client';

import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Calendar as CalendarIcon, Sparkles, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TransactionType } from '@/lib/constants';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: any;
}

export default function TransactionModal({ isOpen, onClose, onSuccess, editData }: TransactionModalProps) {
    const [type, setType] = useState<TransactionType>(editData?.type || 'expense');
    const [amount, setAmount] = useState(editData?.amount || '');
    const [category, setCategory] = useState(editData?.category || '');
    const [description, setDescription] = useState(editData?.description || '');
    const [date, setDate] = useState(() => {
        if (editData?.date) return new Date(editData.date).toISOString().split('T')[0];
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setType(editData?.type || 'expense');
            setAmount(editData?.amount || '');
            setCategory(editData?.category || '');
            setDescription(editData?.description || '');

            if (editData?.date) {
                setDate(new Date(editData.date).toISOString().split('T')[0]);
            } else {
                const now = new Date();
                setDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
            }
            setError('');
        }
    }, [isOpen, editData]);

    const setToday = () => {
        const now = new Date();
        setDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const url = editData ? `/api/transactions/${editData._id}` : '/api/transactions';
            const method = editData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, amount: parseFloat(amount), category, description, date }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Terjadi kesalahan');
                return;
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError('Kesalahan jaringan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.8 }}
                        className="relative w-full max-w-xl glass-morphism border border-white/[0.1] rounded-[3rem] premium-shadow overflow-hidden hardware-accelerated"
                    >
                        {/* Header */}
                        <div className="px-12 py-10 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.4em] italic">
                                    <Sparkles className="w-4 h-4" /> System Command
                                </div>
                                <h2 className="text-3xl font-black text-text-heading tracking-tighter">
                                    {editData ? 'Modify' : 'Initialize'} <span className="text-primary italic">Record</span>
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-text-muted-content hover:text-text-primary-content hover:bg-white/10 transition-all active:scale-90"
                            >
                                <X className="w-7 h-7" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-10">
                            {/* Type Toggle */}
                            <div className="flex p-2 bg-black/5 dark:bg-black/40 rounded-[2rem] border border-black/[0.05] dark:border-white/[0.05]">
                                <button
                                    type="button"
                                    onClick={() => { setType('expense'); setCategory(''); }}
                                    className={cn(
                                        "flex-1 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                                        type === 'expense'
                                            ? "bg-[#EF4444] text-white shadow-[0_15px_30px_rgba(239,68,68,0.4)]"
                                            : "text-text-muted-content hover:text-text-primary-content"
                                    )}
                                >
                                    Expenditure
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setType('income'); setCategory(''); }}
                                    className={cn(
                                        "flex-1 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                                        type === 'income'
                                            ? "bg-[#10B981] text-white shadow-[0_15px_30px_rgba(16,185,129,0.4)]"
                                            : "text-text-muted-content hover:text-text-primary-content"
                                    )}
                                >
                                    Revenue
                                </button>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-text-muted-content uppercase tracking-[0.3em] ml-4 italic">Transactional Volume</label>
                                <div className="relative group">
                                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-text-muted-content/40 font-black text-2xl group-focus-within:text-primary transition-colors italic">Rp</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-black/[0.03] dark:bg-black/40 border border-black/[0.05] dark:border-white/[0.05] hover:border-primary/30 dark:hover:border-white/[0.1] rounded-[2rem] pl-20 pr-8 py-8 focus:border-primary/50 outline-none text-4xl font-black text-text-primary-content tabular-nums tracking-tighter transition-all placeholder:text-text-muted-content/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Date */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-4">
                                        <label className="text-[10px] font-black text-text-muted-content uppercase tracking-[0.3em] italic">Timeline</label>
                                        <button
                                            type="button"
                                            onClick={setToday}
                                            className="text-[9px] font-black text-primary hover:text-text-primary-content transition-colors uppercase tracking-[0.2em]"
                                        >
                                            Now
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted-content/20 group-focus-within:text-primary transition-colors pointer-events-none" />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full bg-black/[0.03] dark:bg-black/40 border border-black/[0.05] dark:border-white/[0.05] hover:border-primary/30 dark:hover:border-white/[0.1] rounded-3xl pl-16 pr-6 py-5 focus:border-primary/50 outline-none text-sm font-black text-text-primary-content transition-all [appearance:none] [-webkit-appearance:none]"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-text-muted-content uppercase tracking-[0.3em] ml-4 italic">Classification</label>
                                    <div className="relative group">
                                        <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted-content/20 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            placeholder="Audit Category"
                                            className="w-full bg-black/[0.03] dark:bg-black/40 border border-black/[0.05] dark:border-white/[0.05] hover:border-primary/30 dark:hover:border-white/[0.1] rounded-3xl pl-16 pr-6 py-5 focus:border-primary/50 outline-none text-sm font-black text-text-primary-content transition-all placeholder:text-text-muted-content/20"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-text-muted-content uppercase tracking-[0.3em] ml-4 italic">System Logs / Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter detailed audit description..."
                                    className="w-full bg-black/[0.03] dark:bg-black/40 border border-black/[0.05] dark:border-white/[0.05] hover:border-primary/30 dark:hover:border-white/[0.1] rounded-3xl px-8 py-5 focus:border-primary/50 outline-none text-sm font-bold text-text-primary-content transition-all placeholder:text-text-muted-content/20"
                                    required
                                />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-4 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 text-[10px] font-black uppercase tracking-[0.2em]"
                                >
                                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                                    Security Error: {error}
                                </motion.div>
                            )}

                            <div className="pt-6 flex gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-5 rounded-3xl border border-white/[0.05] hover:bg-white/[0.03] text-text-muted-content hover:text-text-primary-content font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                                >
                                    Abort
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, translateY: -3 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[1.5] py-5 rounded-3xl gradient-primary text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-4 shadow-glow border border-white/10"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : <Check className="w-6 h-6" />}
                                    {editData ? 'Synchronize Data' : 'Commit Transaction'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

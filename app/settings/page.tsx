'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import {
    Wallet,
    Check,
    AlertCircle,
    Save,
    Sparkles
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export default function SettingsPage() {
    const [dailyLimit, setDailyLimit] = useState<number>(500000);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/budget');
            const data = await res.json();
            setDailyLimit(data.budget.dailyLimit);
        } catch (error) {
            console.error('Fetch settings error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const budgetRes = await fetch('/api/budget', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dailyLimit }),
            });

            if (budgetRes.ok) {
                setMessage('Perubahan berhasil disimpan!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Gagal menyimpan beberapa pengaturan.');
            }
        } catch (error) {
            setMessage('Kesalahan jaringan.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout username="dimas">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-10 pb-20"
            >
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-[#2563EB] text-[10px] font-black uppercase tracking-[0.4em] mb-1 italic">
                        <Sparkles className="w-3.5 h-3.5" /> Identity & Preferences
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter">
                        <span className="text-text-heading">System</span>{" "}
                        <span className="text-[#2563EB] italic">Configurations</span>
                    </h1>
                    <p className="text-text-secondary-content text-sm font-medium italic">Kustomisasi pengalaman FinanceOS sesuai kebutuhan audit dan preferensi visual Anda.</p>
                </div>

                <form onSubmit={handleSave} className="space-y-10">
                    <div className="max-w-2xl mx-auto">
                        {/* Budget Section */}
                        <div className="glass-morphism rounded-[3rem] border border-white/[0.08] premium-shadow relative overflow-hidden group p-12 space-y-10" role="region" aria-label="Budget Threshold Configuration">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow group-hover:scale-110 transition-transform" aria-hidden="true">
                                    <Wallet className="w-7 h-7" />
                                </div>
                                <h2 className="text-2xl font-black text-text-heading tracking-tighter">Threshold Logic</h2>
                            </div>

                            <div className="space-y-6 pt-2">
                                <label className="text-[10px] font-black text-text-muted-content uppercase tracking-[0.3em] ml-4 italic" htmlFor="dailyLimit">Daily Budget Velocity</label>
                                <div className="relative group">
                                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-text-muted-content font-black text-2xl group-focus-within:text-primary transition-colors italic" aria-hidden="true">Rp</span>
                                    <input
                                        id="dailyLimit"
                                        type="number"
                                        value={dailyLimit}
                                        onChange={(e) => setDailyLimit(parseFloat(e.target.value))}
                                        className="w-full bg-black/[0.03] dark:bg-black/20 border border-black/[0.05] dark:border-white/5 hover:border-primary/30 dark:hover:border-white/10 rounded-[2rem] pl-20 pr-8 py-8 focus:border-primary/50 outline-none text-4xl font-black text-text-primary-content tabular-nums tracking-tighter transition-all"
                                        aria-label="Daily budget limit"
                                    />
                                </div>
                                <div className="flex items-center gap-3 p-5 bg-black/[0.03] border border-black/[0.05] rounded-[1.5rem]" role="status">
                                    <AlertCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">
                                        Current Limit: {formatCurrency(dailyLimit)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Action */}
                    <div className="flex flex-col items-center w-full">
                        <motion.button
                            whileHover={{ scale: 1.05, translateY: -5 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={saving || loading}
                            aria-disabled={saving || loading}
                            className="w-full md:w-[450px] py-7 rounded-[2.5rem] gradient-primary text-white font-black uppercase tracking-[0.3em] text-xs shadow-glow border border-white/10 flex items-center justify-center gap-4 transition-all"
                            aria-label="Save all settings"
                        >
                            {saving ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-label="Syncing..." />
                            ) : <Save className="w-6 h-6" aria-hidden="true" />}
                            Synchronize Portal
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={cn(
                                    "p-6 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border",
                                    message.includes('berhasil')
                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                        : "bg-red-500/10 text-red-500 border-red-500/20"
                                )}
                            >
                                {message.includes('berhasil') ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </AppLayout>
    );
}

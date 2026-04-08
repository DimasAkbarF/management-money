'use client';

import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownRight,
    AlertCircle,
} from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCard {
    title: string;
    description: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgOpacity: string;
}

interface DashboardCardsProps {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    dailyExpense: number;
    dailyLimit: number;
    loading?: boolean;
}

function SkeletonCard() {
    return (
        <div className="glass-morphism rounded-[2rem] p-6 border border-white/5 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                    <div className="skeleton h-3 w-20 rounded-full" />
                    <div className="skeleton h-8 w-40 rounded-xl" />
                    <div className="skeleton h-2 w-full rounded-full" />
                </div>
                <div className="skeleton w-12 h-12 rounded-2xl" />
            </div>
        </div>
    );
}

export default function DashboardCards({
    totalIncome,
    totalExpense,
    balance,
    dailyExpense,
    dailyLimit,
    loading = false,
}: DashboardCardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }

    const cards: StatCard[] = [
        {
            title: 'Income',
            description: 'TOTAL REVENUE',
            value: totalIncome,
            icon: TrendingUp,
            accentColor: '#10b981',
            bgOpacity: 'bg-[#10b981]/15',
        },
        {
            title: 'Expense',
            description: 'TOTAL SPENDING',
            value: totalExpense,
            icon: TrendingDown,
            accentColor: '#ef4444',
            bgOpacity: 'bg-[#ef4444]/15',
        },
        {
            title: 'Balance',
            description: 'NET LIQUIDITY',
            value: balance,
            icon: Wallet,
            accentColor: '#3b82f6',
            bgOpacity: 'bg-[#3b82f6]/15',
        },
        {
            title: 'Daily',
            description: 'DAILY LIMIT',
            value: dailyExpense,
            icon: ShoppingBag,
            accentColor: '#f59e0b',
            bgOpacity: 'bg-[#f59e0b]/15',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const cardVariants: any = {
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 30,
                mass: 0.8
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
            {cards.map((card) => {
                const Icon = card.icon;
                const isOverLimit = card.title === 'Daily' && dailyLimit > 0 && dailyExpense > dailyLimit;
                const progress = card.title === 'Daily' && dailyLimit > 0 ? Math.min((dailyExpense / dailyLimit) * 100, 100) : 0;

                return (
                    <motion.div
                        key={card.title}
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="glass-morphism rounded-[3rem] p-8 border border-black/[0.05] dark:border-white/[0.08] premium-shadow relative overflow-hidden group hardware-accelerated"
                        role="region"
                        aria-label={`${card.title} overview`}
                    >
                        {/* Interactive Radial Glow - Contained within a nested overflow-hidden div to prevent bleeding */}
                        <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
                            <div
                                className="absolute -right-10 -top-10 w-40 h-40 blur-[80px] opacity-10 dark:opacity-20 transition-opacity group-hover:opacity-30 dark:group-hover:opacity-50"
                                style={{ backgroundColor: card.accentColor }}
                            />
                        </div>

                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <h2 className="text-text-secondary-content font-bold uppercase text-[10px] tracking-widest">
                                        {card.description}
                                    </h2>
                                    {isOverLimit && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-tighter border border-red-500/20 animate-pulse" role="alert" aria-label="Budget limit exceeded">
                                            <AlertCircle className="w-2.5 h-2.5" /> High Risk
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-text-heading font-black text-2xl tabular-nums tracking-tighter mb-1">
                                    {formatCurrency(Math.abs(card.value))}
                                </h3>

                                {card.title === 'Daily' && dailyLimit > 0 && (
                                    <div className="mt-6 space-y-3">
                                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
                                            <span className="text-text-muted-content">Allocation Guard</span>
                                            <span style={{ color: card.accentColor }} className="text-glow" aria-label={`${Math.round((dailyExpense / dailyLimit) * 100)}% of limit used`}>
                                                {Math.round((dailyExpense / dailyLimit) * 100)}%
                                            </span>
                                        </div>
                                        <div
                                            className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.03]"
                                            role="progressbar"
                                            aria-valuenow={Math.round((dailyExpense / dailyLimit) * 100)}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label="Daily spending limit progress"
                                            aria-valuetext={`${Math.round((dailyExpense / dailyLimit) * 100)}% of daily limit consumed`}
                                        >
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                                                className="h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] origin-left"
                                                style={{ backgroundColor: card.accentColor, width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {card.title === 'Balance' && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className={cn(
                                            "flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                            card.value >= 0 ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                                        )} aria-label={card.value >= 0 ? "Financial surplus" : "Financial deficit"}>
                                            {card.value >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                            {card.value >= 0 ? 'Surplus' : 'Deficit'}
                                        </div>
                                        <span className="text-[9px] font-bold text-text-muted-content uppercase tracking-widest">
                                            System Verified
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className={cn(
                                "w-16 h-16 rounded-[1.75rem] flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-500 group-hover:rotate-6 shadow-xl dark:shadow-2xl border border-black/[0.03] dark:border-white/[0.08]",
                                card.bgOpacity
                            )} aria-hidden="true">
                                <div style={{ color: card.accentColor }} className="drop-shadow-[0_0_12px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                                    <Icon className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

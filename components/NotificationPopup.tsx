'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface NotificationPopupProps {
    dailyExpense: number;
    dailyLimit: number;
}

export default function NotificationPopup({ dailyExpense, dailyLimit }: NotificationPopupProps) {
    const [show, setShow] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const exceeded = dailyLimit > 0 && dailyExpense > dailyLimit;

    useEffect(() => {
        if (exceeded && !dismissed) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 6000);
            return () => clearTimeout(timer);
        }
    }, [exceeded, dismissed]);

    if (!show || dismissed) return null;

    return (
        <div
            className={cn(
                'fixed bottom-6 right-6 z-50 max-w-sm w-full',
                'bg-card border border-red-500/30 rounded-2xl shadow-xl p-4',
                'animate-in slide-in-from-bottom-4 duration-300'
            )}
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Batas Anggaran Harian Terlampaui!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Anda telah menghabiskan{' '}
                        <span className="text-red-500 font-bold">{formatCurrency(dailyExpense)}</span>{' '}
                        hari ini, melebihi batas Anda sebesar{' '}
                        <span className="font-medium">{formatCurrency(dailyLimit)}</span>.
                    </p>
                </div>
                <button
                    onClick={() => { setShow(false); setDismissed(true); }}
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            {/* Progress bar */}
            <div
                className="mt-3 w-full bg-muted rounded-full h-1.5 overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round((dailyExpense / dailyLimit) * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Daily spending progress"
            >
                <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{ width: `${Math.min((dailyExpense / dailyLimit) * 100, 100)}%` }}
                />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 text-right" aria-label={`${Math.round((dailyExpense / dailyLimit) * 100)}% of limit used`}>
                {Math.round((dailyExpense / dailyLimit) * 100)}% dari anggaran harian terpakai
            </p>
        </div>
    );
}

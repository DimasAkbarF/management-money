'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Dashboard Error:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-morphism max-w-md w-full p-10 rounded-[2.5rem] border border-white/10 text-center space-y-8"
            >
                <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20 shadow-glow-red">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>

                <div className="space-y-3">
                    <h2 className="text-2xl font-black text-white tracking-tight">System Interrupted</h2>
                    <p className="text-white/40 text-sm font-medium leading-relaxed">
                        Terjadi kesalahan saat memuat dashboard. Ini mungkin masalah koneksi atau data yang tidak valid.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full py-4 rounded-2xl gradient-primary text-white font-bold flex items-center justify-center gap-3 shadow-glow"
                    >
                        <RefreshCcw className="w-5 h-5" /> Coba Lagi
                    </button>

                    <Link
                        href="/"
                        className="w-full py-4 rounded-2xl bg-white/5 text-white/60 font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                    >
                        <Home className="w-5 h-5" /> Kembali ke Home
                    </Link>
                </div>

                <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest pt-4">
                    Error ID: {error.digest || 'Internal Runtime Failure'}
                </p>
            </motion.div>
        </div>
    );
}

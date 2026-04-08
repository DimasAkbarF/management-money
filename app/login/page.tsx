'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Wallet, Lock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            router.push('/dashboard');
            router.refresh();
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30">
            {/* Background decoration - Advanced Radial Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 rounded-full blur-[160px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 1 }}
                className="w-full max-w-[420px] sm:w-[420px] px-4 sm:px-0 relative z-10"
            >
                {/* Main Glass Container */}
                <div className="glass-morphism border border-black/5 dark:border-white/10 rounded-[2.5rem] premium-shadow overflow-hidden backdrop-blur-2xl">
                    {/* Header Section */}
                    <div className="px-6 sm:px-10 pt-10 sm:pt-12 pb-6 sm:pb-8 text-center relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                        {/* <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow border border-white/20"
                        >
                            <Wallet className="w-8 h-8 text-white" />
                        </motion.div> */}

                        <div className="space-y-2">
                            {/* <div className="flex items-center justify-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[9px] opacity-80">
                                <Lock className="w-3 h-3" /> Secure Access
                            </div> */}
                            <h1 className="text-3xl font-black text-text-heading tracking-tight">
                                Finance<span className="text-primary italic">OS</span>
                            </h1>
                            <p className="text-text-secondary-content text-xs font-medium mt-2 max-w-[240px] mx-auto leading-relaxed">
                                Enter your credentials to access your secure financial terminal.
                            </p>
                        </div>
                    </div>

                    {/* Form Body */}
                    <div className="px-6 sm:px-10 pb-10 sm:pb-12">
                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                            {/* Username Input Container */}
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold text-text-muted-content uppercase tracking-widest ml-1" htmlFor="username">
                                    Username
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors">
                                        <User className="w-4.5 h-4.5 text-text-muted-content/50 dark:text-white/20 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={cn(
                                            'w-full pl-14 pr-6 py-4 rounded-2xl border bg-black/[0.02] dark:bg-white/[0.03] text-text-primary-content placeholder:text-text-muted-content/20 transition-all duration-300',
                                            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40',
                                            'border-black/[0.08] dark:border-white/[0.08] hover:border-black/10 dark:hover:border-white/[0.15] text-base'
                                        )}
                                        placeholder="Enter username"
                                        required
                                        autoComplete="username"
                                        aria-required="true"
                                    />
                                </div>
                            </div>

                            {/* Password Input Container */}
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold text-text-muted-content uppercase tracking-widest ml-1" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors">
                                        <Lock className="w-4.5 h-4.5 text-text-muted-content/50 dark:text-white/20 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={cn(
                                            'w-full pl-14 pr-14 py-4 rounded-2xl border bg-black/[0.02] dark:bg-white/[0.03] text-text-primary-content placeholder:text-text-muted-content/20 transition-all duration-300',
                                            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40',
                                            'border-black/[0.08] dark:border-white/[0.08] hover:border-black/10 dark:hover:border-white/[0.15] text-base'
                                        )}
                                        placeholder="Enter password"
                                        required
                                        autoComplete="current-password"
                                        aria-required="true"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-text-muted-content/30 hover:text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Alert/Error Container */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-3"
                                        role="alert"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Access Denied: {error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Master Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.01, translateY: -1 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                aria-disabled={loading}
                                className={cn(
                                    'w-full py-4 rounded-2xl font-bold text-white transition-all duration-300',
                                    'gradient-primary shadow-glow border border-white/10 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]',
                                    'disabled:opacity-60 disabled:cursor-not-allowed'
                                )}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-label="Authenticating..." />
                                ) : (
                                    <>
                                        Sign In
                                        <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white]" />
                                    </>
                                )}
                            </motion.button>
                        </form>


                        <div className="mt-8 p-5 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-2xl text-center">
                            {/* <p className="text-[9px] font-bold text-text-muted-content uppercase tracking-widest mb-3">
                                Demo Account
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <div className="px-2.5 py-1 rounded-md bg-black/[0.05] dark:bg-black/40 border border-black/[0.05] dark:border-white/[0.05] text-[9px] font-bold text-primary tracking-widest">dimas</div>
                                <div className="px-2.5 py-1 rounded-md bg-black/[0.05] dark:bg-black/40 border border-black/[0.05] dark:border-white/[0.05] text-[9px] font-bold text-text-muted-content tracking-widest">dimas123</div>
                            </div> */}
                        </div>
                    </div>
                </div>

                <p className="text-center text-[9px] font-bold text-text-muted-content/40 uppercase tracking-[0.4em] mt-8">
                    v2.4.0 — Secure Terminal
                </p>
            </motion.div>

        </div>
    );
}

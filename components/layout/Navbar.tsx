'use client';

import { LogOut, User, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface NavbarProps {
    username?: string;
    sidebarCollapsed: boolean;
    onMobileMenuToggle: () => void;
}

export default function Navbar({
    username = 'dimas',
    sidebarCollapsed,
    onMobileMenuToggle,
}: NavbarProps) {
    const router = useRouter();
    const [showProfile, setShowProfile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setShowProfile(false);
            }
        };
        if (showProfile) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showProfile]);

    const handleLogout = async () => {
        setShowProfile(false);
        await fetch('/api/login', { method: 'DELETE' });
        router.push('/login');
        router.refresh();
    };

    return (
        <header
            className={cn(
                'fixed top-0 right-0 h-24 z-30 flex items-center justify-between px-10 transition-[left] duration-500 ease-in-out',
                'bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-[16px] border-b border-[#E2E8F0] dark:border-white/[0.08] hardware-accelerated',
                'left-0 lg:left-[var(--sidebar-width)]'
            )}
        >
            <div className="flex items-center gap-6">
                <button
                    onClick={onMobileMenuToggle}
                    className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-text-muted-content"
                    aria-label="Toggle mobile menu"
                >
                    <Menu className="w-6 h-6" aria-hidden="true" />
                </button>
                <div className="hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted-content">
                        {mounted ? new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }) : 'Memuat tanggal...'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-4 px-3 py-2 rounded-[2rem] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all active:scale-[0.98] border border-transparent hover:border-black/[0.05] dark:hover:border-white/[0.05]"
                        aria-label="User profile menu"
                        aria-expanded={showProfile}
                        aria-haspopup="true"
                    >
                        <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center shadow-2xl border-2 border-white/10 overflow-hidden" aria-hidden="true">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-black leading-tight text-text-heading tracking-tight">{username}</p>
                            <p className="text-[10px] text-primary leading-tight font-black uppercase tracking-[0.2em] mt-1">Verified Expert</p>
                        </div>
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 top-full mt-4 w-64 bg-white dark:bg-[#161B26] border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl z-[110] overflow-hidden animate-spring-in backdrop-blur-3xl">
                            <div className="px-6 py-5 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                                <p className="font-black text-text-heading text-base">{username}</p>
                                <p className="text-[10px] text-text-muted-content font-bold uppercase tracking-widest mt-0.5">FinanceOS Identity</p>
                            </div>
                            <div className="p-3">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-5 py-4 text-sm text-[#EF4444] font-black hover:bg-[#EF4444]/10 rounded-2xl transition-all"
                                    aria-label="Terminate current session and sign out"
                                >
                                    <LogOut className="w-5 h-5" aria-hidden="true" />
                                    Keluar Sesi
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

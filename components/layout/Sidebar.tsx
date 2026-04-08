'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ArrowLeftRight,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Tooltip from '@/components/ui/Tooltip';

export interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

const navItems = [
    { href: '/dashboard', label: 'Beranda', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transaksi', icon: ArrowLeftRight },
    { href: '/reports', label: 'Laporan', icon: BarChart3 },
    { href: '/settings', label: 'Pengaturan', icon: Settings },
];

const springTransition: any = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 0.8,
};

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 h-full z-40 flex flex-col bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-[16px] border-r border-[#E2E8F0] dark:border-white/[0.08] shadow-2xl transition-[width] duration-500 ease-in-out',
                'lg:translate-x-0',
                mobileOpen ? 'translate-x-0' : '-translate-x-full',
                'hardware-accelerated'
            )}
            style={{
                width: 'var(--sidebar-width)',
                contain: 'size layout',
                willChange: 'width'
            }}
        >
            {/* Logo Section */}
            <div className={cn(
                'flex items-center h-24 px-6 flex-shrink-0 border-b border-white/[0.03]',
                collapsed ? 'justify-center' : 'justify-between'
            )}>
                <Link href="/" className="flex items-center gap-4 min-w-0" aria-label="FinanceOS Home">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg"
                        aria-hidden="true"
                    >
                        <Wallet className="w-6 h-6 text-white" />
                    </motion.div>

                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ delay: 0.1 }}
                                className="font-black text-xl tracking-tight truncate bg-clip-text text-transparent bg-gradient-to-r from-text-heading to-text-secondary-content"
                            >
                                FinanceOS
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>

                {!collapsed && (
                    <motion.button
                        layout
                        onClick={onToggle}
                        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-text-muted-content hover:text-primary dark:hover:text-white transition-colors"
                        aria-label="Collapse sidebar"
                    >
                        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    </motion.button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar" aria-label="Main navigation">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || pathname.startsWith(href + '/');

                    const NavLink = (
                        <Link
                            href={href}
                            onClick={onMobileClose}
                            className={cn(
                                'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group',
                                isActive
                                    ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)]'
                                    : 'text-text-muted-content hover:bg-[#F1F5F9] dark:hover:bg-white/5 hover:text-text-heading border border-transparent'
                            )}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={label}
                        >
                            <div className="flex items-center gap-4 w-full">
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full"
                                        transition={springTransition}
                                    />
                                )}

                                <Icon className={cn(
                                    'w-5 h-5 flex-shrink-0 transition-all duration-300',
                                    isActive ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:scale-110'
                                )} aria-hidden="true" />

                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ delay: 0.1 }}
                                            className="font-bold text-sm tracking-wide"
                                        >
                                            {label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Link>
                    );

                    return collapsed ? (
                        <Tooltip key={href} content={label} side="right">{NavLink}</Tooltip>
                    ) : (
                        <div key={href}>{NavLink}</div>
                    );
                })}
            </nav>

            {/* Collapse Toggle for Smallened Mode */}
            {collapsed && (
                <div className="p-4 flex justify-center border-t border-white/5">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onToggle}
                        className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-muted-content hover:text-primary dark:hover:text-white"
                        aria-label="Expand sidebar"
                    >
                        <ChevronRight className="w-5 h-5" aria-hidden="true" />
                    </motion.button>
                </div>
            )}

            {/* Footnote */}
            {!collapsed && (
                <div className="px-6 py-6 border-t border-black/[0.05] dark:border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted-content text-center">
                        FinanceOS PRO v2.0
                    </p>
                </div>
            )}
        </aside>
    );
}

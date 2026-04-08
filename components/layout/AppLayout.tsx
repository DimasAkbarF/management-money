'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface AppLayoutProps {
    children: React.ReactNode;
    username?: string;
}

export default function AppLayout({ children, username }: AppLayoutProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('sidebar-collapsed');
        if (stored !== null) setCollapsed(JSON.parse(stored));
    }, []);

    const handleToggle = () => {
        setCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem('sidebar-collapsed', JSON.stringify(next));
            return next;
        });
    };

    // Render shell immediately for SSR/LCP — only sidebar collapse state needs mount
    const sidebarWidth = mounted ? (collapsed ? '80px' : '260px') : '260px';

    return (
        <div
            className="min-h-screen bg-background text-foreground selection:bg-primary/30"
            style={{
                '--sidebar-width': sidebarWidth,
            } as React.CSSProperties}
        >
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-30 lg:hidden cursor-pointer"
                        onClick={() => setMobileOpen(false)}
                        role="button"
                        aria-label="Close mobile navigation overlay"
                    />
                )}
            </AnimatePresence>

            <Sidebar
                collapsed={collapsed}
                onToggle={handleToggle}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <Navbar
                username={username}
                sidebarCollapsed={collapsed}
                onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
            />

            <main
                className="transition-[padding] duration-500 ease-in-out pt-24 min-h-screen lg:pl-[var(--sidebar-width)] hardware-accelerated"
                style={{ contain: 'layout', willChange: 'padding-left' }}
            >
                <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}

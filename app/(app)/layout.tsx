'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Persist sidebar collapsed state
    useEffect(() => {
        const stored = localStorage.getItem('sidebar-collapsed');
        if (stored !== null) setCollapsed(JSON.parse(stored));
    }, []);

    const handleToggle = () => {
        setCollapsed(prev => {
            const next = !prev;
            localStorage.setItem('sidebar-collapsed', JSON.stringify(next));
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <Sidebar
                collapsed={collapsed}
                onToggle={handleToggle}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <Navbar
                username="dimas"
                sidebarCollapsed={collapsed}
                onMobileMenuToggle={() => setMobileOpen(prev => !prev)}
            />

            <main
                className={cn(
                    'transition-all duration-300 pt-16 min-h-screen',
                    'lg:pl-[260px]',
                    collapsed && 'lg:pl-[72px]'
                )}
            >
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

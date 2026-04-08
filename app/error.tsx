'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('System Critical Error:', error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{ background: '#020617', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
                <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center', animation: 'fadein .3s ease' }}>
                    <style>{`@keyframes fadein{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>

                    {/* Inline SVG — no lucide-react bundle cost */}
                    <div style={{ width: 88, height: 88, background: 'rgba(239,68,68,.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(239,68,68,.15)' }} role="img" aria-label="Error icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M12 8v4M12 16h.01" />
                        </svg>
                    </div>

                    <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.5px' }}>Critical System Failure</h1>
                    <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 32px' }}>
                        A high-level system exception has occurred that requires manual restoration or system reset.
                    </p>

                    <button
                        onClick={() => reset()}
                        style={{ width: '100%', padding: '18px', borderRadius: '16px', background: '#2563EB', color: '#fff', fontWeight: 900, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                        aria-label="Reset and restore system"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        Restore System
                    </button>

                    <p style={{ fontSize: '9px', color: 'rgba(255,255,255,.1)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '32px' }}>
                        {error.digest || 'Unknown Application Fault'}
                    </p>
                </div>
            </body>
        </html>
    );
}

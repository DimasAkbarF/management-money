'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    className?: string;
}

export default function Tooltip({
    children,
    content,
    side = 'right',
    align = 'center',
    className,
}: TooltipProps) {
    return (
        <TooltipPrimitive.Provider delayDuration={200}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <AnimatePresence>
                        <TooltipPrimitive.Content
                            side={side}
                            align={align}
                            sideOffset={10}
                            className={cn(
                                'z-[100] px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xl glass backdrop-blur-md border border-white/20 select-none flex items-center gap-2',
                                className
                            )}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: side === 'right' ? -10 : 0 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex items-center gap-2"
                            >
                                {content}
                            </motion.div>
                            <TooltipPrimitive.Arrow className="fill-white/10" />
                        </TooltipPrimitive.Content>
                    </AnimatePresence>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}

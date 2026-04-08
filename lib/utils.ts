import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'IDR'): string {
    if (currency === 'IDR') {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

export function formatDate(date: string | Date): string {
    const d = new Date(date);
    // If it's a string like "YYYY-MM-DD", new Date(date) creates it in UTC.
    // We want to display it as is, or adjust for timezone.
    // For personal finance, usually we want the date as stored.
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(d);
}

export function formatDateInput(date: string | Date): string {
    return new Date(date).toISOString().split('T')[0];
}

'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from 'next-themes';

interface ChartProps {
    data: { name: string; value: number }[];
}

function CategoryPieChartComponent({ data }: ChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const hasData = data && data.length > 0 && data.some(d => d.value > 0);

    const options: ApexCharts.ApexOptions = useMemo(() => ({
        chart: {
            type: 'donut',
            background: 'transparent',
            animations: { enabled: false }
        },
        labels: data.map((d) => d.name),
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'],
        stroke: { show: false },
        dataLabels: { enabled: false },
        legend: { show: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '80%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: isDark ? 'rgba(255, 255, 255, 0.4)' : '#64748b'
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 900,
                            color: isDark ? '#FFFFFF' : '#0f172a',
                            formatter: (val: string | number) => {
                                const numericVal = typeof val === 'string' ? parseFloat(val) : val;
                                return numericVal >= 1000 ? `${(numericVal / 1000).toFixed(1)}k` : numericVal.toString();
                            },
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            color: isDark ? 'rgba(255, 255, 255, 0.4)' : '#64748b',
                            formatter: () => {
                                const sum = data.reduce((acc, curr) => acc + curr.value, 0);
                                return sum >= 1000 ? `${(sum / 1000).toFixed(1)}k` : sum.toString();
                            },
                        },
                    },
                },
            },
        },
        theme: { mode: isDark ? 'dark' : 'light' },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            style: { fontSize: '12px' }
        },
    }), [data, isDark]); // Restored isDark dependency

    const series = useMemo(() => data.map((d) => d.value), [data]);

    return (
        <div
            className="w-full h-[350px] flex items-center justify-center hardware-accelerated"
            style={{ contain: 'strict', overflow: 'hidden' }}
            role="img"
            aria-label="Expense category breakdown chart"
        >
            {!isMounted ? (
                <div className="skeleton h-full w-full" aria-hidden="true" />
            ) : !hasData ? (
                <div className="text-center p-8" aria-label="No expense data available">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted-content/40">Data pengeluaran kosong</p>
                </div>
            ) : (
                <ReactApexChart options={options} series={series} type="donut" height={350} width="100%" />
            )}
        </div>
    );
}

const CategoryPieChart = memo(CategoryPieChartComponent);
export default CategoryPieChart;

'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from 'next-themes';

interface ChartProps {
    data: { date: string; amount: number }[];
}

function formatCurrency(val: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(val);
}

function RealtimeLineChartComponent({ data }: ChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const options: ApexCharts.ApexOptions = useMemo(() => ({
        chart: {
            type: 'area',
            toolbar: { show: false },
            animations: { enabled: false },
            background: 'transparent',
            sparkline: { enabled: false },
        },
        stroke: { curve: 'smooth', width: 4, lineCap: 'round' },
        colors: ['#3B82F6'],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'vertical',
                shadeIntensity: 0.5,
                gradientToColors: ['#60A5FA'],
                inverseColors: false,
                opacityFrom: 0.6,
                opacityTo: 0.1,
                stops: [0, 100]
            },
        },
        xaxis: {
            categories: data.map((d) => d.date),
            labels: {
                style: {
                    fontSize: '10px',
                    fontWeight: 600,
                    colors: isDark ? 'rgba(255, 255, 255, 0.4)' : '#64748b'
                },
                offsetY: 5
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
            crosshairs: {
                show: true,
                stroke: { color: '#3B82F6', width: 1, dashArray: 4 },
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '10px',
                    fontWeight: 600,
                    colors: isDark ? 'rgba(255, 255, 255, 0.4)' : '#64748b'
                },
                formatter: (val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toString()),
            },
        },
        grid: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            strokeDashArray: 4,
            padding: { left: 20, right: 20 }
        },
        theme: { mode: isDark ? 'dark' : 'light' },
        markers: {
            size: 0,
            hover: { size: 6 }
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            x: { show: true },
            y: { formatter: (val) => formatCurrency(val) },
            style: { fontSize: '12px' }
        },
    }), [data, isDark]); // Restored isDark dependency

    const series = useMemo(() => [{ name: 'Pengeluaran', data: data.map((d) => d.amount) }], [data]);

    return (
        <div
            className="w-full h-[350px] flex items-center justify-center hardware-accelerated"
            style={{ contain: 'strict', overflow: 'hidden' }}
            role="img"
            aria-label="Expenditure trend chart"
        >
            {isMounted ? (
                <ReactApexChart options={options} series={series} type="area" height={350} width="100%" />
            ) : (
                <div className="skeleton h-full w-full" aria-hidden="true" />
            )}
        </div>
    );
}

const RealtimeLineChart = memo(RealtimeLineChartComponent);
export default RealtimeLineChart;

export const dynamic = "force-dynamic";
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Budget from '@/models/Budget';
import LoginLog from '@/models/LoginLog';
import { getUserFromRequest } from '@/lib/auth';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subDays, format, parseISO } from 'date-fns';

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        const { searchParams } = new URL(req.url);
        const todayStr = searchParams.get('today');
        const today = todayStr ? parseISO(todayStr) : new Date();

        const userId = user.userId;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const startMonth = startOfMonth(today);
        const endMonth = endOfMonth(today);
        const yesterdayEnd = endOfDay(subDays(today, 1));

        // Define time ranges for charts
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
        const months = Array.from({ length: 6 }, (_, i) => {
            const d = subDays(today, i * 30);
            return { start: startOfMonth(d), end: endOfMonth(d), label: format(d, 'MMM yy') };
        }).reverse();

        // Parallelize ALL data fetching
        const [
            incomeAggReal,
            expenseAggReal,
            expenseAggHist,
            todayAgg,
            budget,
            securityLogs,
            recent,
            categoryData,
            ...historicalDaysRaw
        ] = await Promise.all([
            // 1. Real-time Month totals
            Transaction.aggregate([
                { $match: { userId: userObjectId, type: 'income', date: { $gte: startMonth, $lte: endMonth } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            Transaction.aggregate([
                { $match: { userId: userObjectId, type: 'expense', date: { $gte: startMonth, $lte: endMonth } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            // 2. Historical Month totals (Excluding Today)
            Transaction.aggregate([
                { $match: { userId: userObjectId, type: 'expense', date: { $gte: startMonth, $lte: yesterdayEnd } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            // 3. Today calculation
            Transaction.aggregate([
                { $match: { userId: userObjectId, type: 'expense', date: { $gte: startOfDay(today), $lte: endOfDay(today) } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            // 4. Budget
            Budget.findOne({ userId }),
            // 5. Security Alerts
            LoginLog.find({ userId }).sort({ timestamp: -1 }).limit(3).lean(),
            // 6. Recent transactions
            Transaction.find({ userId }).sort({ date: -1 }).limit(5).lean(),
            // 7. Category breakdown
            Transaction.aggregate([
                { $match: { userId: userObjectId, type: 'expense', date: { $gte: startMonth, $lte: endMonth } } },
                { $group: { _id: '$category', value: { $sum: '$amount' } } },
                { $project: { _id: 0, name: '$_id', value: 1 } },
                { $sort: { value: -1 } }
            ]),
            // 8. Last 7 days historical data
            ...last7Days.map(day => Transaction.aggregate([
                { $match: { userId: userObjectId, type: 'expense', date: { $gte: startOfDay(day), $lte: endOfDay(day) } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]))
        ]);

        const totalIncomeReal = incomeAggReal[0]?.total || 0;
        const totalExpenseHist = expenseAggHist[0]?.total || 0;
        const dailyExpense = todayAgg[0]?.total || 0;
        const balance = totalIncomeReal - (expenseAggReal[0]?.total || 0);

        const dailyData = historicalDaysRaw.map((agg, i) => ({
            date: format(last7Days[i], 'MMM dd'),
            amount: (agg as any)[0]?.total || 0
        }));

        // 9. Monthly data (last 6 months) - This is still separate to avoid complexity, but we can parallelize the months
        const monthlyData = await Promise.all(
            months.map(async ({ start, end, label }) => {
                const [incAgg, expAgg] = await Promise.all([
                    Transaction.aggregate([
                        { $match: { userId: userObjectId, type: 'income', date: { $gte: start, $lte: end } } },
                        { $group: { _id: null, total: { $sum: '$amount' } } },
                    ]),
                    Transaction.aggregate([
                        { $match: { userId: userObjectId, type: 'expense', date: { $gte: start, $lte: end } } },
                        { $group: { _id: null, total: { $sum: '$amount' } } },
                    ]),
                ]);
                return {
                    month: label,
                    income: incAgg[0]?.total || 0,
                    expense: expAgg[0]?.total || 0,
                };
            })
        );

        return NextResponse.json({
            stats: {
                totalIncome: totalIncomeReal,
                totalExpense: totalExpenseHist,
                balance,
                dailyExpense,
                dailyLimit: (budget as any)?.dailyLimit || 50000,
                budgetExceeded: dailyExpense > ((budget as any)?.dailyLimit || 50000),
            },
            charts: {
                dailyExpense: dailyData,
                categoryBreakdown: categoryData,
                monthlyData,
            },
            recentTransactions: recent,
            securityLogs: (securityLogs as any[]).map(log => ({
                id: log._id.toString(),
                status: log.status,
                time: format(log.timestamp, 'HH:mm'),
                date: format(log.timestamp, 'yyyy-MM-dd')
            }))
        });
    } catch (error) {
        console.error('GET dashboard error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

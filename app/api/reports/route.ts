export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { getUserFromRequest } from '@/lib/auth';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        const { searchParams } = new URL(req.url);
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = { userId: user.userId };

        if (dateFrom || dateTo) {
            query.date = {};
            if (dateFrom) query.date.$gte = startOfDay(parseISO(dateFrom));
            if (dateTo) query.date.$lte = endOfDay(parseISO(dateTo));
        }

        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .lean();

        const totalIncome = transactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return NextResponse.json({
            transactions,
            summary: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                count: transactions.length,
            },
        });
    } catch (error) {
        console.error('GET reports error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

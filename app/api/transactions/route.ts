import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Budget from '@/models/Budget';
import { getUserFromRequest } from '@/lib/auth';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const type = searchParams.get('type') || '';
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = { userId: user.userId };

        if (search) {
            query.$or = [
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }
        if (category) query.category = category;
        if (type) query.type = type;
        if (dateFrom || dateTo) {
            query.date = {};
            if (dateFrom && !dateTo) {
                // If only dateFrom is provided, filter for that specific day
                query.date.$gte = startOfDay(parseISO(dateFrom));
                query.date.$lte = endOfDay(parseISO(dateFrom));
            } else {
                if (dateFrom) query.date.$gte = startOfDay(parseISO(dateFrom));
                if (dateTo) query.date.$lte = endOfDay(parseISO(dateTo));
            }
        }

        const total = await Transaction.countDocuments(query);
        const transactions = await Transaction.find(query)
            .sort({ date: -1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({ transactions, total, page, limit });
    } catch (error) {
        console.error('GET transactions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        const body = await req.json();
        const { type, amount, category, description, date } = body;

        if (!type || !amount || !category || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const amountNum = parseFloat(amount);

        // Check daily budget limit if expense (Gross based)
        if (type === 'expense') {
            const budget = await Budget.findOne({ userId: user.userId });
            const limit = (budget && budget.dailyLimit > 0) ? budget.dailyLimit : 50000;

            const contextDate = date ? new Date(date) : new Date();

            const todayExpAgg = await Transaction.aggregate([
                {
                    $match: {
                        userId: user.userId,
                        type: 'expense',
                        date: { $gte: startOfDay(contextDate), $lte: endOfDay(contextDate) },
                    },
                },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);

            const currentTotalExp = todayExpAgg[0]?.total || 0;
            const newGrossExpense = currentTotalExp + amountNum;

            if (newGrossExpense > limit) {
                const remaining = Math.max(0, limit - currentTotalExp);
                return NextResponse.json({
                    error: `Batas pengeluaran harian tidak mencukupi! (Sisa jatah belanja hari ini: Rp ${remaining.toLocaleString('id-ID')})`,
                    budgetExceeded: true
                }, { status: 400 });
            }
        }

        const transaction = await Transaction.create({
            userId: user.userId,
            type,
            amount: amountNum,
            category,
            description,
            date: date ? new Date(date) : new Date(),
        });

        return NextResponse.json({ transaction }, { status: 201 });
    } catch (error) {
        console.error('POST transaction error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Budget from '@/models/Budget';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';
import { startOfDay, endOfDay } from 'date-fns';

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        const { id } = params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await req.json();
        const { type, amount, category, description, date } = body;

        // Fetch current transaction for budget adjustment
        const existingTx = await Transaction.findOne({ _id: id, userId: user.userId });
        if (!existingTx) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        const newAmount = amount !== undefined ? parseFloat(amount) : existingTx.amount;
        const newType = type || existingTx.type;
        const newDate = date ? new Date(date) : existingTx.date;

        // Check budget if it's an expense (Gross based)
        if (newType === 'expense') {
            const budget = await Budget.findOne({ userId: user.userId });
            const limit = (budget && budget.dailyLimit > 0) ? budget.dailyLimit : 50000;

            const todayExpAgg = await Transaction.aggregate([
                {
                    $match: {
                        userId: user.userId,
                        type: 'expense',
                        date: { $gte: startOfDay(newDate), $lte: endOfDay(newDate) },
                    },
                },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);

            const currentTotalExp = todayExpAgg[0]?.total || 0;

            // Subtract old amount if it was an expense on the same day
            const isSameDay = startOfDay(existingTx.date).getTime() === startOfDay(newDate).getTime();
            const adjustedExp = isSameDay && existingTx.type === 'expense'
                ? currentTotalExp - existingTx.amount
                : currentTotalExp;

            const newGrossExpense = adjustedExp + newAmount;

            if (newGrossExpense > limit) {
                const remaining = Math.max(0, limit - adjustedExp);
                return NextResponse.json({
                    error: `Batas pengeluaran harian tidak mencukupi! (Sisa jatah belanja hari ini: Rp ${remaining.toLocaleString('id-ID')})`,
                    budgetExceeded: true
                }, { status: 400 });
            }
        }

        const transaction = await Transaction.findOneAndUpdate(
            { _id: id, userId: user.userId },
            {
                ...(type && { type }),
                ...(amount !== undefined && { amount: parseFloat(amount) }),
                ...(category && { category }),
                ...(description && { description }),
                ...(date && { date: new Date(date) }),
            },
            { returnDocument: 'after' }
        );

        return NextResponse.json({ transaction });
    } catch (error) {
        console.error('PUT transaction error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        const { id } = params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const transaction = await Transaction.findOneAndDelete({
            _id: id,
            userId: user.userId,
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE transaction error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

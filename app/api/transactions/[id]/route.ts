import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

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

        const transaction = await Transaction.findOneAndUpdate(
            { _id: id, userId: user.userId },
            {
                ...(type && { type }),
                ...(amount && { amount: parseFloat(amount) }),
                ...(category && { category }),
                ...(description && { description }),
                ...(date && { date: new Date(date) }),
            },
            { returnDocument: 'after' }
        );

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

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

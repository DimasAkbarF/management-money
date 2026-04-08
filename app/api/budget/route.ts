export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        const budget = await Budget.findOne({ userId: user.userId });
        if (!budget) {
            const newBudget = await Budget.create({ userId: user.userId, dailyLimit: 500000 });
            return NextResponse.json({ budget: newBudget });
        }

        return NextResponse.json({ budget });
    } catch (error) {
        console.error('GET budget error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        const { dailyLimit } = await req.json();

        if (dailyLimit === undefined || dailyLimit < 0) {
            return NextResponse.json({ error: 'Invalid daily limit' }, { status: 400 });
        }

        const budget = await Budget.findOneAndUpdate(
            { userId: user.userId },
            { dailyLimit: parseFloat(dailyLimit) },
            { upsert: true, returnDocument: 'after' }
        );

        return NextResponse.json({ budget });
    } catch (error) {
        console.error('PUT budget error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

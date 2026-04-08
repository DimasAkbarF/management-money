export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        const settings = await Settings.findOne({ userId: user.userId });
        if (!settings) {
            const newSettings = await Settings.create({
                userId: user.userId,
                theme: 'dark',
                currency: 'IDR',
            });
            return NextResponse.json({ settings: newSettings });
        }

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('GET settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        const body = await req.json();
        const { theme, currency } = body;

        const updateData: Record<string, string> = {};
        if (theme) updateData.theme = theme;
        if (currency) updateData.currency = currency;

        const settings = await Settings.findOneAndUpdate(
            { userId: user.userId },
            updateData,
            { upsert: true, returnDocument: 'after' }
        );

        // Also update user theme
        if (theme) {
            await User.findByIdAndUpdate(user.userId, { theme });
        }

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('PUT settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Settings from '@/models/Settings';
import Budget from '@/models/Budget';
import LoginLog from '@/models/LoginLog';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { username, password } = await req.json();
        const userAgent = req.headers.get('user-agent') || 'Unknown';
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ username: username.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        // Log the login attempt
        await LoginLog.create({
            userId: user._id,
            status: isValid ? 'success' : 'fail',
            ip,
            userAgent
        });

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Ensure settings & budget exist
        await Settings.findOneAndUpdate(
            { userId: user._id },
            { $setOnInsert: { userId: user._id, theme: user.theme, currency: 'IDR' } },
            { upsert: true, returnDocument: 'after' }
        );
        await Budget.findOneAndUpdate(
            { userId: user._id },
            { $setOnInsert: { userId: user._id, dailyLimit: 500000 } },
            { upsert: true, returnDocument: 'after' }
        );

        const token = await signToken({
            userId: user._id.toString(),
            username: user.username,
        });

        const response = NextResponse.json({
            success: true,
            user: { id: user._id, username: user.username, theme: user.theme },
        });

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        if (error.name === 'MongooseServerSelectionError' || error.message.includes('buffering timed out')) {
            return NextResponse.json({
                error: 'Database connection timeout. Please check your MongoDB MONGODB_URI and IP whitelist in Atlas.'
            }, { status: 503 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('auth-token');
    return response;
}

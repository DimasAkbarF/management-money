import connectDB from '../lib/mongodb';
import User from '../models/User';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';
import Settings from '../models/Settings';
import bcrypt from 'bcryptjs';

async function seed() {
    await connectDB();

    // Create default user
    const existingUser = await User.findOne({ username: 'dimas' });
    let user = existingUser;

    if (!existingUser) {
        const passwordHash = await bcrypt.hash('dimas123', 12);
        user = await User.create({
            username: 'dimas',
            passwordHash,
            theme: 'dark',
        });
        console.log('✅ User created: dimas / dimas123');
    } else {
        console.log('ℹ️ User already exists: dimas');
    }

    // Create budget
    await Budget.findOneAndUpdate(
        { userId: user!._id },
        { dailyLimit: 500000 },
        { upsert: true }
    );

    // Create settings
    await Settings.findOneAndUpdate(
        { userId: user!._id },
        { theme: 'dark', currency: 'IDR' },
        { upsert: true }
    );

    // Seed sample transactions
    const existingTransactions = await Transaction.countDocuments({ userId: user!._id });
    if (existingTransactions === 0) {
        const now = new Date();
        const transactions = [
            // Income
            { userId: user!._id, type: 'income', amount: 8000000, category: 'Salary', description: 'Monthly salary March', date: new Date(now.getFullYear(), now.getMonth(), 1) },
            { userId: user!._id, type: 'income', amount: 1500000, category: 'Freelance', description: 'Web design project', date: new Date(now.getFullYear(), now.getMonth(), 10) },
            { userId: user!._id, type: 'income', amount: 500000, category: 'Investment', description: 'Stock dividends', date: new Date(now.getFullYear(), now.getMonth(), 15) },
            { userId: user!._id, type: 'income', amount: 7500000, category: 'Salary', description: 'Monthly salary Feb', date: new Date(now.getFullYear(), now.getMonth() - 1, 1) },
            { userId: user!._id, type: 'income', amount: 6000000, category: 'Salary', description: 'Monthly salary Jan', date: new Date(now.getFullYear(), now.getMonth() - 2, 1) },
            { userId: user!._id, type: 'income', amount: 2000000, category: 'Freelance', description: 'App development', date: new Date(now.getFullYear(), now.getMonth() - 1, 20) },
            // Expense
            { userId: user!._id, type: 'expense', amount: 150000, category: 'Food & Drinks', description: 'Grocery shopping', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
            { userId: user!._id, type: 'expense', amount: 50000, category: 'Transportation', description: 'Grab rides', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
            { userId: user!._id, type: 'expense', amount: 2500000, category: 'Rent', description: 'Monthly rent', date: new Date(now.getFullYear(), now.getMonth(), 5) },
            { userId: user!._id, type: 'expense', amount: 350000, category: 'Shopping', description: 'New shoes', date: new Date(now.getFullYear(), now.getMonth(), 8) },
            { userId: user!._id, type: 'expense', amount: 120000, category: 'Entertainment', description: 'Netflix + Spotify', date: new Date(now.getFullYear(), now.getMonth(), 9) },
            { userId: user!._id, type: 'expense', amount: 85000, category: 'Food & Drinks', description: 'Restaurant dinner', date: new Date(now.getFullYear(), now.getMonth(), 12) },
            { userId: user!._id, type: 'expense', amount: 200000, category: 'Health', description: 'Doctor visit', date: new Date(now.getFullYear(), now.getMonth(), 14) },
            { userId: user!._id, type: 'expense', amount: 300000, category: 'Utilities', description: 'Electricity & water', date: new Date(now.getFullYear(), now.getMonth(), 3) },
            { userId: user!._id, type: 'expense', amount: 1800000, category: 'Rent', description: 'Monthly rent Feb', date: new Date(now.getFullYear(), now.getMonth() - 1, 5) },
            { userId: user!._id, type: 'expense', amount: 450000, category: 'Shopping', description: 'Electronics', date: new Date(now.getFullYear(), now.getMonth() - 1, 18) },
            { userId: user!._id, type: 'expense', amount: 95000, category: 'Food & Drinks', description: 'Lunch meetings', date: new Date(now.getFullYear(), now.getMonth() - 1, 22) },
            { userId: user!._id, type: 'expense', amount: 1600000, category: 'Rent', description: 'Monthly rent Jan', date: new Date(now.getFullYear(), now.getMonth() - 2, 5) },
            { userId: user!._id, type: 'expense', amount: 250000, category: 'Education', description: 'Online courses', date: new Date(now.getFullYear(), now.getMonth() - 2, 10) },
            { userId: user!._id, type: 'expense', amount: 180000, category: 'Transportation', description: 'Monthly commute', date: new Date(now.getFullYear(), now.getMonth() - 2, 15) },
            { userId: user!._id, type: 'expense', amount: 75000, category: 'Food & Drinks', description: 'Coffee & snacks', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1) },
            { userId: user!._id, type: 'expense', amount: 220000, category: 'Food & Drinks', description: 'Weekend brunch', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2) },
            { userId: user!._id, type: 'expense', amount: 130000, category: 'Transportation', description: 'Gas', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3) },
            { userId: user!._id, type: 'expense', amount: 500000, category: 'Travel', description: 'Weekend trip', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4) },
        ];

        await Transaction.insertMany(transactions);
        console.log(`✅ Seeded ${transactions.length} sample transactions`);
    } else {
        console.log(`ℹ️ Transactions already exist (${existingTransactions} records)`);
    }

    console.log('🎉 Seed complete!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
});

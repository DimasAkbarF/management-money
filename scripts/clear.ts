import connectDB from '../lib/mongodb';
import Transaction from '../models/Transaction';

async function clear() {
    await connectDB();
    const result = await Transaction.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} transactions.`);
    console.log('🎉 Data cleared!');
    process.exit(0);
}

clear().catch((err) => {
    console.error('Clear error:', err);
    process.exit(1);
});

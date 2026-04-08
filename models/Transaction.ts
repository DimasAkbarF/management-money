import mongoose, { Schema, Document, Model } from 'mongoose';
import { TransactionType, CATEGORIES } from '@/lib/constants';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: TransactionType;
    amount: number;
    category: string;
    description: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    { timestamps: true }
);

TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, type: 1 });

const Transaction: Model<ITransaction> =
    mongoose.models.Transaction ||
    mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;

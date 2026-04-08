import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBudget extends Document {
    userId: mongoose.Types.ObjectId;
    dailyLimit: number;
    updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        dailyLimit: {
            type: Number,
            required: true,
            default: 500000, // IDR 500,000
            min: 0,
        },
    },
    { timestamps: true }
);

const Budget: Model<IBudget> =
    mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;

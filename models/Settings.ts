import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
    userId: mongoose.Types.ObjectId;
    theme: 'light' | 'dark';
    currency: string;
    updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'dark',
        },
        currency: {
            type: String,
            default: 'IDR',
        },
    },
    { timestamps: true }
);

const Settings: Model<ISettings> =
    mongoose.models.Settings ||
    mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;

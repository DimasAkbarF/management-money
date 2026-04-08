import mongoose from 'mongoose';

const LoginLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['success', 'fail'],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    ip: String,
    userAgent: String,
});

export default mongoose.models.LoginLog || mongoose.model('LoginLog', LoginLogSchema);

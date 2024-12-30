import mongoose, { Schema, Document, CallbackError } from 'mongoose';

export interface ISubscription extends Document {
    expiredDate: Date;
    user: mongoose.Types.ObjectId;
    paymentType: string;
    price: number;
    subscribedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
    expiredDate: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentType: { type: String, required: true, maxlength: 200 },
    price: { type: Number, required: true, min: 1 },
    subscribedAt: { type: Date, required: true },
});

SubscriptionSchema.pre('save', async function (next: (err?: CallbackError) => void) {
    try {
        // ...
        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
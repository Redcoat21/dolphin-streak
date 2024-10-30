import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema()
export class Subscription {
    @Prop({ required: true })
    expiredDate: Date;

    @Prop({
        required: true,
        type: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    })
    user: User;

    @Prop({ required: true, length: 200 })
    paymentType: string;

    @Prop({ required: true, min: 1 })
    price: number;

    @Prop({ required: true })
    subscribedAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Connection, Document, HydratedDocument } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export type ForumReplyDocument = HydratedDocument<ForumReply>;
export type ForumDocument = HydratedDocument<Forum>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ForumReply {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    user: User;

    @Prop({ required: true, maxLength: 765 })
    content: string;
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Forum extends Document {
    @Prop({ required: true, maxLength: 255, index: 'text' })
    title: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    user: User;

    @Prop({ required: true, maxLength: 765, index: 'text' })
    content: string;

    @Prop({
        required: true,
        default: [],
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "ForumReply" }],
    })
    replies: ForumReply[];
}

export const ForumReplySchema = SchemaFactory.createForClass(ForumReply);
export const ForumSchema = SchemaFactory.createForClass(Forum);

ForumSchema.pre("findOneAndDelete", async function (next) {
    try {
        const forum = await this.model.findOne(this.getQuery());
        if (forum?.replies?.length > 0) {
            const connection: Connection = this.model.db;
            const ForumReplyModel = connection.model("ForumReply");
            await ForumReplyModel.deleteMany({ _id: { $in: forum.replies } });
        }
        next();
    } catch (error) {
        next(error);
    }
});

ForumReplySchema.pre("findOneAndDelete", async function (next) {
    try {
        const reply = await this.model.findOne(this.getQuery());
        if (reply) {
            const connection: Connection = this.model.db;
            const ForumModel = connection.model("Forum");
            await ForumModel.updateMany(
                { replies: reply._id },
                { $pull: { replies: reply._id } },
            );
        }
        next();
    } catch (error) {
        next(error);
    }
});

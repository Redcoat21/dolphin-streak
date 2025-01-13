import mongoose, { Schema, Document } from 'mongoose';
import UserModel from './user.model';

export interface IForumReply extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt?: Date;
}

export interface IForum extends Document {
    title: string;
    user: mongoose.Types.ObjectId;
    content: string;
    replies: mongoose.Types.ObjectId[];
    createdAt?: Date;
}

const ForumReplySchema = new Schema<IForumReply>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 765 },
}, { timestamps: { createdAt: true, updatedAt: false } });

ForumReplySchema.pre('findOneAndDelete', async function (next) {
    try {
        const reply = await this.model.findOne(this.getQuery());
        if (reply) {
            await mongoose.model('Forum').updateMany(
                { replies: reply._id },
                { $pull: { replies: reply._id } }
            );
        }
        next();
    } catch (error) {
        next(error as mongoose.CallbackError);
    }
});

const ForumSchema = new Schema<IForum>({
    title: { type: String, required: true, maxlength: 255, index: 'text' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 765, index: 'text' },
    replies: [{ type: mongoose.Types.ObjectId, ref: 'ForumReply', default: [] }],
}, { timestamps: { createdAt: true, updatedAt: false } });

ForumSchema.pre('findOneAndDelete', async function (next) {
    try {
        const forum = await this.model.findOne(this.getQuery());
        if (forum?.replies?.length) {
            await mongoose.model('ForumReply').deleteMany({ _id: { $in: forum.replies } });
        }
        next();
    } catch (error) {
        next(error as mongoose.CallbackError);
    }
});

export const ForumReply = mongoose.model<IForumReply>('ForumReply', ForumReplySchema);
export const Forum = mongoose.model<IForum>('Forum', ForumSchema);

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Course } from './courses/schemas/course.schema';
// import { User } from './users/schemas/user.schema';
// import { Level } from './levels/schemas/level.schema';
// import { Language } from './languages/schemas/language.schema';

// @Injectable()
// export class SeederService {
//   constructor(
//     @InjectModel(Course.name) private courseModel: Model<Course>,
//     @InjectModel(User.name) private userModel: Model<User>,
//     @InjectModel(Level.name) private levelModel: Model<Level>,
//     @InjectModel(Language.name) private languageModel: Model<Language>,
//   ) {}

//   async seed() {
//     try {
//       await this.seedLanguages();
//       const languageIds = await this.languageModel.find().select('_id').lean();
//       await this.seedLevels(languageIds);
//       await this.seedCourses(languageIds);
//       await this.seedUsers(languageIds);
//     } catch (error) {
//       console.error('Seeding error:', error);
//     }
//   }

//   private async seedLanguages() {
//     const languages = [
//       { name: 'English', image: 'https://static.vecteezy.com/system/resources/previews/000/388/356/original/illustration-of-uk-flag-vector.jpg' },
//       { name: 'Chinese', image: 'https://tse4.mm.bing.net/th/id/OIP.wjN7jAdy5evtymlw1-AZogHaE7?rs=1&pid=ImgDetMain' },
//       { name: 'Indonesian', image: 'https://www.worldatlas.com/r/w1200-h701-c1200x701/upload/9f/69/0a/id-flag.jpg' },
//     ];

//     for (const language of languages) {
//       await this.languageModel.updateOne({ name: language.name }, language, { upsert: true });
//     }
//   }

//   private async seedLevels(languageIds: { _id: string }[]) {
//     const levels = [
//       { name: 'Beginner', languageId: languageIds[0]._id },
//       { name: 'Intermediate', languageId: languageIds[0]._id },
//       { name: 'Advanced', languageId: languageIds[0]._id },
//       { name: 'Beginner', languageId: languageIds[1]._id },
//       { name: 'Intermediate', languageId: languageIds[1]._id },
//       { name: 'Advanced', languageId: languageIds[1]._id },
//       { name: 'Beginner', languageId: languageIds[2]._id },
//       { name: 'Intermediate', languageId: languageIds[2]._id },
//       { name: 'Advanced', languageId: languageIds[2]._id },
//     ];

//     for (const level of levels) {
//       await this.levelModel.updateOne({ name: level.name, languageId: level.languageId }, level, { upsert: true });
//     }
//   }

//   private async seedCourses(languageIds: { _id: string }[]) {
//     const levelIds = await this.levelModel.find().select('_id').lean();

//     const courses = [
//       {
//         name: 'Course 1',
//         levels: [levelIds[0]._id, levelIds[1]._id],
//         language: languageIds[0]._id,
//         type: 0,
//         thumbnail: 'https://example.com/course1.png',
//       },
//       {
//         name: 'Course 2',
//         levels: [levelIds[2]._id, levelIds[3]._id],
//         language: languageIds[1]._id,
//         type: 1,
//         thumbnail: 'https://example.com/course2.png',
//       },
//     ];

//     for (const course of courses) {
//       await this.courseModel.updateOne({ name: course.name }, course, { upsert: true });
//     }
//   }

//   private async seedUsers(languageIds: { _id: string }[]) {
//     const users = [
//       {
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'johndoe@example.com',
//         password: 'password123',
//         provider: 'local',
//         role: 'user',
//         languages: [languageIds[0]._id],
//         completedCourses: [] as string[],
//       },
//       {
//         firstName: 'Jane',
//         lastName: 'Doe',
//         email: 'janedoe@example.com',
//         password: 'password123',
//         provider: 'local',
//         role: 'user',
//         languages: [languageIds[1]._id],
//         completedCourses: [] as string[],
//       },
//     ];

//     for (const user of users) {
//       await this.userModel.updateOne({ email: user.email }, user, { upsert: true });
//     }
//   }
// }

/**
 * import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Course } from "src/courses/schemas/course.schema";
import { Language } from "src/languages/schemas/language.schema";
import * as argon2 from "argon2";

export enum Role {
    ADMIN,
    USER,
}

export enum Provider {
    LOCAL,
    GOOGLE,
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, maxlength: 100 })
    firstName: string;

    @Prop({ required: false, maxlength: 100 })
    lastName?: string;

    @Prop({ required: true, index: true, unique: true, maxlength: 255 })
    email: string;

    @Prop({ required: true, maxlength: 150 })
    password: string;

    @Prop({ required: false })
    birthDate?: Date;

    @Prop({
        required: true,
        maxlength: 25,
        enum: Provider,
        default: Provider.LOCAL,
    })
    provider: Provider;

    @Prop({ required: false, maxlength: 255 })
    sub?: string;

    @Prop({
        required: true,
        maxlength: 500,
        default:
            "https://res.cloudinary.com/dmzt7dywt/image/upload/v1732208251/ghozali-default_zgyths.jpg",
    })
    profilePicture?: string;

    @Prop({ required: true, default: [], type: [Date] })
    loginHistories: Date[];

    @Prop({ required: true, enum: Role, default: Role.USER })
    role: Role;

    @Prop({
        required: true,
        default: [],
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Language" }],
    })
    languages: Language[];

    @Prop({
        required: true,
        default: [],
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    })
    completedCourses: Course[];

    @Prop({ required: false, maxlength: 100 })
    subscriptionId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual 'id' property that maps to _id
UserSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Ensure virtuals are included when converting document to JSON
UserSchema.set('toJSON', {
    virtuals: true,
    transform: (_, converted) => {
        delete converted._id;
        delete converted.__v;
        return converted;
    }
});

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hashedPassword = await argon2.hash(this.password);
        this.password = hashedPassword;
    }
    next();
});

 * 
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Language } from "../../languages/schemas/language.schema";

export type LevelDocument = HydratedDocument<Level>;

@Schema()
export class Level {
    @Prop({ required: true, maxlength: 255 }) // Replaced length with maxlength
    name: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
    })
    language: Language;
}

export const LevelSchema = SchemaFactory.createForClass(Level);
 *
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Language } from "src/languages/schemas/language.schema";
import { Level } from "src/levels/schemas/level.schema";

export type CourseDocument = HydratedDocument<Course>;

export enum CourseType {
    Daily = 0,
    Weekly = 1,
}

@Schema()
export class Course {
    @Prop({ required: true, maxlength: 255 })
    name: string;

    @Prop({
        required: true,
        default: [],
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Level" }],
    })
    levels: Level[];

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language", // Remove the extra `{ type: ... }` object
    })
    language: Language;

    @Prop({ required: true, maxlength: 255, enum: CourseType })
    type: CourseType;

    @Prop({ required: false, maxlength: 255 })
    thumbnail: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
 *
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LanguageDocument = HydratedDocument<Language>;

@Schema()
export class Language {
    @Prop({ required: true, maxlength: 255 })
    name: string;

    @Prop({ required: true, maxlength: 255 })
    image: string;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
 *
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
 * 
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Document } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export enum FeedbackType {
    REPORT,
    FEEDBACK
};

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({ timestamps: true })
export class Feedback extends Document {
    @Prop({ type: mongoose.Types.ObjectId, ref: "User", required: true  })
    user: User;

    @Prop({ required: true, maxLength: 255, enum: FeedbackType })
    type: FeedbackType;

    @Prop({ required: true, maxLength: 500 })
    content: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
 *
import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Course } from "src/courses/schemas/course.schema";
import { QuestionDetail } from "src/lib/types/question.type";

export enum QuestionType {
    MULTIPLE_CHOICE,
    ESSAY,
    FILL_IN,
    VOICE,
    WRITING,
}

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
    @Prop(raw({
        type: { type: String, maxlength: 50 },
        text: { type: String, maxlength: 500 },
        voice: { type: String, maxlength: 500 },
    }))
    question: QuestionDetail;

    @Prop({
        required: true,
        enum: QuestionType,
    })
    type: QuestionType;

    @Prop({ required: false, type: [String] })
    answerOptions: string[];

    @Prop({ required: false, type: [String, Number] })
    correctAnswer?: number | string;

    @Prop({ required: true })
    useAi: boolean;

    @Prop({
        required: true,
        default: [],
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    })
    courses: Course[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
 *
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DateTime } from "luxon";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import * as argon2 from "argon2";

export type ResetPasswordDocument = HydratedDocument<ResetPassword>;

@Schema()
export class ResetPassword {
    // The unique token that will be used to reset the password.
    @Prop({ required: true })
    token: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;

    // Default creation date will be now.
    @Prop({ required: false, default: () => DateTime.now().toJSDate() })
    createdAt: Date;

    // Default expiration date will be 15 minutes from now.
    @Prop({
        required: false,
        default: () => DateTime.now().plus({ minute: 15 }).toJSDate(),
    })
    expiredAt: Date;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);

ResetPasswordSchema.pre("save", async function (next) {
    if (this.isModified("token")) {
        const hashedToken = await argon2.hash(this.token);
        this.token = hashedToken;
    }
    next();
});

ResetPasswordSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
 *
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export type Token = {
    token: string;
    expires: Date;
};

export type DeviceInfo = {
    userAgent: string;
    browser?: string;
    cpu?: string;
    device?: string;
    engine?: string;
    os?: string;
    ip: string;
};

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true })
export class Session extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    user: User;

    @Prop({
        required: true,
        type: {
            token: { type: String, required: true },
            expires: { type: Date, required: true },
        },
    })
    accessToken: Token;

    @Prop({
        required: true,
        type: {
            token: { type: String, required: true },
            expires: { type: Date, required: true },
        },
    })
    refreshToken: Token;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({
        type: {
            userAgent: { type: String, required: true },
            browser: { type: String, required: false },
            cpu: { type: String, required: false },
            device: { type: String, required: false },
            engine: { type: String, required: false },
            os: { type: String, required: false },
            ip: { type: String, required: true },
        },
    })
    deviceInfo: DeviceInfo;

    @Prop({ default: Date.now })
    lastActive: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
 *
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

    @Prop({ required: true, maxlengt: 200 })
    paymentType: string;

    @Prop({ required: true, minlength: 1 })
    price: number;

    @Prop({ required: true })
    subscribedAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

 */


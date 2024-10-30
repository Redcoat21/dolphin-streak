import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Language } from "src/languages/schemas/language.schema";
import { Course } from "src/courses/entities/course.entity";

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
    @Prop({ required: true, length: 100 })
    firstName: string;

    @Prop({ required: false, length: 100 })
    lastName?: string;

    @Prop({ required: true, index: true, unique: true, length: 255 })
    email: string;

    @Prop({ required: true, length: 150 })
    password: string;

    @Prop({ required: false })
    birthDate?: Date;

    @Prop({
        required: true,
        length: 25,
        enum: Provider,
        default: Provider.LOCAL,
    })
    provider: Provider;

    @Prop({ required: false, length: 255 })
    sub?: string;

    @Prop({ required: true, length: 500 })
    profilePicture: string;

    @Prop({ required: true, default: [], type: [Date] })
    loginHistories: Date[];

    @Prop({ required: false, length: 255 })
    accessToken?: string;

    @Prop({ required: false, length: 255 })
    refreshToken?: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);

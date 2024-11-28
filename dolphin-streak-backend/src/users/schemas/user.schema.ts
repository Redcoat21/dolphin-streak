import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
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

    @Prop({ required: false, maxlength: 255 })
    accessToken?: string;

    @Prop({ required: false, maxlength: 255 })
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

    @Prop({ required: false, maxlength: 100 })
    subscriptionId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hashedPassword = await argon2.hash(this.password);
        this.password = hashedPassword;
    }
    next();
});

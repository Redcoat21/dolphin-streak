import mongoose, { Document, Schema } from 'mongoose';
import * as argon2 from 'argon2';

// Define Enums using TypeScript's `enum` keyword
export enum Role {
    ADMIN,
    USER,
}

export enum Provider {
    LOCAL,
    GOOGLE,
}

// Define an Interface for the User Document, extending Mongoose's Document
export interface UserDocument extends Document {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    birthDate?: Date;
    provider: Provider;
    sub?: string;
    profilePicture?: string;
    loginHistories: Date[];
    role: Role;
    languages: mongoose.Types.ObjectId[]; // Array of ObjectIds referencing Language
    completedCourses: mongoose.Types.ObjectId[]; // Array of ObjectIds referencing Course
    subscriptionId?: string;
}

// Define the User Schema using `mongoose.Schema`
const UserSchema: Schema<UserDocument> = new mongoose.Schema(
    {
        firstName: { type: String, required: true, maxlength: 100 },
        lastName: { type: String, maxlength: 100 },
        email: { type: String, required: true, index: true, unique: true, maxlength: 255 },
        password: { type: String, required: true, maxlength: 150 },
        birthDate: { type: Date },
provider: { type: String as any, enum: Object.values(Provider), default: Provider.LOCAL.toString() },
        sub: { type: String, maxlength: 255 },
        profilePicture: {
            type: String,
            maxlength: 500,
            default:
                "https://res.cloudinary.com/dmzt7dywt/image/upload/v1732208251/ghozali-default_zgyths.jpg",
        },
        loginHistories: [{ type: Date, default: [] }], // Ensure default value matches the schema
role: { type: String as any, enum: Object.values(Role), default: Role.USER.toString() },
        languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language', default: [] }], // Add default if specified
        completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: [] }], // Add default if specified
        subscriptionId: { type: String, maxlength: 100 },
    },
    { timestamps: true } // Enable timestamps (createdAt, updatedAt)
);

// Add Virtual Property for 'id' (as in the Javascript code)
UserSchema.virtual('id').get(function (this: UserDocument) {
    return this._id.toHexString();
});

// Configure `toJSON` transformation to include virtuals and remove sensitive fields
UserSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Important: Never expose the hashed password
    },
});

// Implement the `pre('save')` middleware for password hashing
UserSchema.pre<UserDocument>("save", async function (next) {
    if (this.isModified("password")) {
        try {
            const hashedPassword = await argon2.hash(this.password);
            this.password = hashedPassword;
            next();
        } catch (error: any) {
            next(error); // Handle potential hashing errors
        }
    } else {
        next(); // If password is not modified, proceed to the next middleware
    }
});

// Create and Export the Mongoose Model
const UserModel = mongoose.model<UserDocument>('User', UserSchema);
export default UserModel;

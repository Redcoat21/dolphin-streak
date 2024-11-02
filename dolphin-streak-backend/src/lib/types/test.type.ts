import { Provider } from "src/users/schemas/user.schema";
import { Role } from "src/users/schemas/user.schema";

export type ExpectedUser = {
    _id: string;
    firstName: string;
    password: string;
    lastName?: string;
    birthDate?: Date;
    email: string;
    provider: Provider;
    profilePicture: string;
    loginHistories: [];
    role: Role;
    languages: [];
    completedCourses: [];
    __v: number;
    createdAt: Date;
    updatedAt: Date;
};
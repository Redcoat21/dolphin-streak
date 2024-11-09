import { UserDocument } from "src/users/schemas/user.schema";

export const extractPassword = (user: UserDocument) => {
    const { password, ...userResponse } = user?.toObject();
    return userResponse;
};

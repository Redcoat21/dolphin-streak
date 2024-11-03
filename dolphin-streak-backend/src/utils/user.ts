import { UserDocument } from "src/users/schemas/user.schema";

export const extractPassword = (user: UserDocument) => {
    console.log("raka gnarly");
    console.log(user);
    const { password, ...userResponse } = user?.toObject();
    return userResponse;
};

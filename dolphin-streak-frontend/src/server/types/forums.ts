export type TGetAllForumsResponse = {
    messages: string;
    data: TForum[];
};

export type TForum = {
    _id: string;
    title: string;
    user: TUser;
    content: string;
    replies: string[];
    createdAt: string; // ISO date string
    __v: number;
};

export type TUser = {
    _id: string;
    email: string;
};

import { z } from 'zod';

export const ZGetAllForumsRequest = z.object({
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(10),
  max_page: z.number().optional().default(1),
  search: z.string().optional(),
});

export type TGetAllForumsRequest = z.infer<typeof ZGetAllForumsRequest>;

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

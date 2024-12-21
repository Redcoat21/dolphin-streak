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
  createdAt: string;
  __v: number;
};

export type TUser = {
  _id: string;
  email: string;
  username: string;
  avatarSrc: string;
};

export const ZGetForumsDetailRequest = z.object({
  forumId: z.string(),
  accessToken: z.string(),
});

export type TGetForumDetailResponse = {
  messages: string;
  data: {
    _id: string;
    title: string;
    user: TUser;
    content: string;
    replies: Array<{
      _id: string;
      user: string;
      content: string;
      createdAt: string;
      __v: number;
    }>;
    createdAt: string;
    __v: number;
  };
};

export const ZCreateForumReplyRequest = z.object({
  forumId: z.string(),
  accessToken: z.string(),
  title: z.string(),
  content: z.string(),
});

export type TCreateForumReplyResponse = {
  messages: string;
  data: {
    _id: string;
    user: string;
    content: string;
    createdAt: string;
    __v: number;
  };
};

export const ZCreateThreadRequest = z.object({
  accessToken: z.string(),
  title: z.string(),
  content: z.string(),
});

export type TCreateThreadResponse = {
  messages: string;
  data: {
    _id: string;
    title: string;
    user: TUser;
    content: string;
    replies: string[];
    createdAt: string;
    __v: number;
  };
};

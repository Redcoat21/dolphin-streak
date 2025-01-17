import { z } from "zod";
import { TDefaultResponse } from "./generic";

export enum FeedbackType {
    REPORT = 0,
    FEEDBACK = 1
};

export enum SortType {
    NEWEST = 'newest',
    OLDEST = 'oldest'
}

export const ZGetAllFeedback = z.object({
    accessToken: z.string(),
    search: z.string().optional(),
    type: z.enum([FeedbackType.REPORT.toString(), FeedbackType.FEEDBACK.toString(), "any"]).optional(),
    sort: z.enum([SortType.NEWEST, SortType.OLDEST]).optional()
})

export type TGetAllFeedback = z.infer<typeof ZGetAllFeedback>

export type TFeedbackItem = {
    "_id": string,
    "user": {
        "email": string,
        "id": string
    },
    "type": FeedbackType,
    "content": string,
    "createdAt": string,
    "updatedAt": string,
    "__v": number
}

export type TGetAllFeedbackResponse = TDefaultResponse<TFeedbackItem[]>

export const ZFeedbackGetByID = z.object({
    feedbackId: z.string().min(1),
})

export type TFeedbackDetailReponse = TDefaultResponse<{
    "_id": string,
    "content": string,
    "user": {
        "email": string,
        "id": string
    },
    "__v": number,
    "createdAt": string,
    "type": FeedbackType,
    "updatedAt": string
}>

export const ZPostNewFeedback = z.object({
    type: z.enum([FeedbackType.REPORT.toString(), FeedbackType.FEEDBACK.toString()]),
    content: z.string().min(1),
})

export type TPostNewFeedback = z.infer<typeof ZPostNewFeedback>
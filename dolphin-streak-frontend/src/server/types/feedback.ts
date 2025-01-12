import { z } from "zod";

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
    type: z.enum([FeedbackType.REPORT, FeedbackType.FEEDBACK, "any"]).optional(),
    sort: z.enum([SortType.NEWEST, SortType.OLDEST]).optional()
})

export type TGetAllFeedback = z.infer<typeof ZGetAllFeedback>
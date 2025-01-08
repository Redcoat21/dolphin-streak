import { z } from "zod";
import { QuestionType, TQuestion } from "./questions";
import { TDefaultResponse, TAnswerResult } from "./generic";
import { ZCourse, ZGetCourseByIdRequest, ZGetCoursesRequest, ZPostStartCourseSession, ZPostSubmitAnswerRequest } from "./courses";

// export const ZPostStartComprehension = z.object({
//     accessToken: z.string(),
//     languageId: z.string(),
// });
export const ZPostStartComprehension = ZPostStartCourseSession

export type TStartComprehensionResponse = TDefaultResponse<{
    comprehensionId: string;
    expiresAt: string;
    totalQuestions: number;
}>;

export const ZGetComprehensionSessionRequest = ZGetCourseByIdRequest

export type TGetComprehensionSessionResponse = TDefaultResponse<{
    question: TQuestion;
    totalQuestion: number;
    questionIndex: number;
    score: number;
}>;

export const ZPostSubmitComprehensionAnswerRequest = ZPostSubmitAnswerRequest

export type TSubmitComprehensionAnswerResponse = TDefaultResponse<TAnswerResult>;

export const ZGetAllComprehensionsRequest = ZGetCoursesRequest

export const ZComprehension = ZCourse

export const ZGetAllComprehensionsResponse = z.object({
    data: z.array(ZComprehension),
    message: z.string(),
    status: z.number(),
});

export type TGetAllComprehensionsResponse = z.infer<typeof ZGetAllComprehensionsResponse>;

export const ZGetComprehensionByIdRequest = z.object({
    id: z.string(),
});

export type TComprehensionResponse = TDefaultResponse<z.infer<typeof ZComprehension>>;

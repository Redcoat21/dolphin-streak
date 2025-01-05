import { z } from "zod";
import type { TDefaultResponse } from "./generic";
import type { QuestionType } from "./questions";

// Schema for a single course level
export const ZCourseLevel = z.object({
  _id: z.string(),
  name: z.string(),
});

// Schema for the language object in a course
export const ZCourseLanguage = z.object({
  _id: z.string(),
  name: z.string(),
  image: z.string(),
  __v: z.number(),
});

// Schema for a single course
export const ZCourse = z.object({
  _id: z.string(),
  name: z.string(),
  levels: z.array(ZCourseLevel),
  language: ZCourseLanguage,
  type: z.number(),
  thumbnail: z.string(),
  __v: z.number(),
});

// Schema for the response when fetching multiple courses
export const ZCoursesResponse = z.object({
  messages: z.string(),
  data: z.array(ZCourse),
});

// Schema for the response when fetching a single course by ID
export const ZCourseResponse = z.object({
  messages: z.string(),
  data: ZCourse,
});

// Input schema for getting courses with filters
export const ZGetCoursesRequest = z.object({
  language: z.string(),
  type: z.number(),
});

// Input schema for getting a course by ID
export const ZGetCourseByIdRequest = z.object({
  id: z.string(),
});

export const ZPostStartCourseSession = z.object({
  courseId: z.string(),
})

// TypeScript types inferred from the Zod schemas
export type TCourse = z.infer<typeof ZCourse>;
export type TCoursesResponse = z.infer<typeof ZCoursesResponse>;
export type TCourseResponse = z.infer<typeof ZCourseResponse>;
export type TGetCoursesRequest = z.infer<typeof ZGetCoursesRequest>;
export type TGetCourseByIdRequest = z.infer<typeof ZGetCourseByIdRequest>;

export enum CourseType {
  Daily = 0,
  Weekly = 1,
}
export function isCourseType(value: number): value is CourseType {
  return Object.values(CourseType).includes(value);
}


export type TStartCourseSessionResponse = TDefaultResponse<{
  "sessionId": string,
  "expiresAt": "2025-01-04T17:44:43.638Z",
  "totalQuestions": number
}>;
export const ZGetCourseSessionIdRequest = z.object({
  courseSessionId: z.string(),
});

type TQuestion = {
  question: {
    type: string;
    text: string;
  };
  answerOptions: string[];
  questionType: QuestionType;
};
type TCourseSessionData = {
  question: TQuestion;
  totalQuestion: number;
  questionIndex: number;
  score: number;
};

export type TGetCourseSessionIdRequest = z.infer<typeof ZGetCourseSessionIdRequest>;
export type TGetCourseSessionIdResponse = TDefaultResponse<TCourseSessionData>;

export const ZPostSubmitAnswerRequest = z.object({
  courseSessionId: z.string(),
  answer: z.string(),
})

export type TAnswerResult = {
  suggestion: string | null;
  isCorrect: boolean;
  isLatest: boolean;
};

export type TSubmitAnswerResponse = TDefaultResponse<TAnswerResult>;
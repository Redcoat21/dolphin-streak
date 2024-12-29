import { z } from "zod";

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

// TypeScript types inferred from the Zod schemas
export type TCourse = z.infer<typeof ZCourse>;
export type TCoursesResponse = z.infer<typeof ZCoursesResponse>;
export type TCourseResponse = z.infer<typeof ZCourseResponse>;
export type TGetCoursesRequest = z.infer<typeof ZGetCoursesRequest>;
export type TGetCourseByIdRequest = z.infer<typeof ZGetCourseByIdRequest>;
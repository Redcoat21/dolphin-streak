import { fetchAPI } from '../../utils/generic';
import { authedProcedure, router } from '../trpc';
import { z } from 'zod';
import type {
  TCoursesResponse,
  TCourseResponse,
} from '../types/courses';
import {
  ZGetCoursesRequest,
  ZGetCourseByIdRequest,
  ZCoursesResponse,
  ZCourseResponse,
} from '../types/courses';

export const coursesRouter = router({
  // Get all courses with filters
  getCourses: authedProcedure
    .input(ZGetCoursesRequest)
    .query(async ({ input }) => {
      const response = await fetchAPI('/api/courses', 'GET', {
        token: input.accessToken,
        query: {
          language: input.language,
          type: input.type,
        },
      });
      return response as TCoursesResponse;
    }),

  // Get a course by its ID
  getCourseById: authedProcedure
    .input(ZGetCourseByIdRequest)
    .query(async ({ input }) => {
      const response = await fetchAPI(
        `/api/courses/${input.id}`,
        'GET',
        {
          token: input.accessToken,
        }
      );
      return response as TCourseResponse;
    }),
});
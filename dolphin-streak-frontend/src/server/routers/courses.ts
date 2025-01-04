import { fetchAPI } from '../../utils/generic';
import { authedProcedure, router } from '../trpc';
import { z } from 'zod';
import type {
  TCoursesResponse,
  TCourseResponse,
  TStartCourseSessionResponse,
} from '../types/courses';
import {
  ZGetCoursesRequest,
  ZGetCourseByIdRequest,
  ZCoursesResponse,
  ZCourseResponse,
  ZPostStartCourseSession,
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
      console.log({ url: `/api/courses/${input.id}` })
      const response = await fetchAPI(
        `/api/courses/${input.id}`,
        'GET',
        {
          token: input.accessToken,
        }
      );
      console.log({ response: JSON.stringify(response) })

      return response as TCourseResponse;
    }),
  startCourse: authedProcedure
    .input(ZPostStartCourseSession)
    .mutation(async ({ input }) => {
      const response = await fetchAPI(
        `/api/courses/${input.courseId}/start-session`,
        'POST',
        {
          token: input.accessToken,
        }
      );
      return response as TStartCourseSessionResponse;
    }),
});


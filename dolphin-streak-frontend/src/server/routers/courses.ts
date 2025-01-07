import { fetchAPI } from '../../utils/generic';
import { authedProcedure, router } from '../trpc';
import { z } from 'zod';
import type {
  TCoursesResponse,
  TCourseResponse,
  TStartCourseSessionResponse,
  TGetCourseSessionIdResponse,
  TSubmitAnswerResponse,
} from '../types/courses';
import {
  ZGetCoursesRequest,
  ZGetCourseByIdRequest,
  ZCoursesResponse,
  ZCourseResponse,
  ZPostStartCourseSession,
  ZGetCourseSessionIdRequest,
  ZPostSubmitAnswerRequest,
} from '../types/courses';
import { QuestionType } from '../types/questions';

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
  getCourseSessionId: authedProcedure.input(ZGetCourseSessionIdRequest).query(async ({ input }) => {
    const response = await fetchAPI(
      `/api/courses/session/${input.courseSessionId}`,
      'GET',
      {
        token: input.accessToken,
      }
    );
    console.log({ response });
    return response as TGetCourseSessionIdResponse;
  }),
  postSubmitAnswer: authedProcedure
    .input(ZPostSubmitAnswerRequest)
    .mutation(async ({ input }) => {
      if (input.questionType == QuestionType.VOICE) {
        // Convert base64 to blob
        const base64Data = input.answer.split(',')[1];
        const binaryData = atob(base64Data);
        const arrayBuffer = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          arrayBuffer[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: 'audio/webm' });

        // Create FormData and append the blob
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');

        const response = await fetchAPI(
          `/api/courses/session/${input.courseSessionId}/submit-answer`,
          'POST',
          {
            token: input.accessToken,
            body: formData,
            // Don't set Content-Type header, let the browser set it with boundary
            isFormData: true
          }
        );
        return response as TSubmitAnswerResponse;
      } else {
        const response = await fetchAPI(
          `/api/courses/session/${input.courseSessionId}/submit-answer`,
          'POST',
          {
            token: input.accessToken,
            body: {
              answer: input.answer
            }
          }
        );
        console.log({ response })
        // {
        //   response: {
        //     messages: 'Successfully Assessed the Answer',
        //     data: { suggestion: null, isCorrect: true, isLatest: false }
        //   }
        // }
        return response as TSubmitAnswerResponse;
      }
    }),
});


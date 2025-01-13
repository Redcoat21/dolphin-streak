import React, { useCallback } from 'react';
import { Container } from "@/core/components/container";
import { CourseType, isCourseType, type TCourse } from "@/server/types/courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BookOpen,
  ChevronLeft,
  Globe,
  Shield,
  Clock,
  Users
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/core/stores/authStore";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Header } from "../../dasboard/components/Header";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Progress } from "@/components/ui/progress";

export function CoursePageID() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  const { getAccessToken } = useAuthStore();
  const accessToken = getAccessToken();
  const { toast } = useToast();

  const { data: courseData, isLoading } = trpc.course.getCourseById.useQuery({
    id: courseId,
    accessToken: accessToken || "",
  });

  const { mutate: startCourseSession, isPending: isStarting } = trpc.course.startCourse.useMutation({
    onSuccess(data) {
      toast({
        title: "Course Started",
        description: "Redirecting to your learning session...",
        variant: "default",
      });
      
      if (data?.data?.sessionId) {
        router.push(`/course/session/${data.data.sessionId}`);
      }
    },
    onError(error) {
      toast({
        title: "Failed to start course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBackToCourses = useCallback(() => {
    router.back();
  }, [router]);

  const handleStartLearning = useCallback(
    (courseId: string) => {
      startCourseSession({ courseId, accessToken: accessToken || "" });
    },
    [startCourseSession, accessToken]
  );

  if (isLoading) {
    return (
      <Container>
        <Header currentPath="/courses" />
        <main className="min-h-screen bg-slate-950 text-white pt-6 pb-6 px-4 sm:pt-10 sm:pb-10 sm:px-6">
          <div className="max-w-xl mx-auto">
            <LoadingSkeleton />
          </div>
        </main>
      </Container>
    );
  }

  const course = courseData?.data as TCourse;

  if (!course) {
    return (
      <Container>
        <Header currentPath="/courses" />
        <main className="min-h-screen bg-slate-950 text-white pt-6 pb-8 px-4 sm:pt-10 sm:pb-10 sm:px-6 xl:mt-8 mt-32">
          <div className="max-w-xl mx-auto text-center">
            <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-400 mb-4 sm:text-2xl">
              Course not found
            </h2>
            <p className="text-slate-500 mb-6">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button
              variant="outline"
              onClick={handleBackToCourses}
              className="text-slate-400 border-slate-700 hover:bg-slate-800 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </div>
        </main>
      </Container>
    );
  }

  return (
    <Container>
      <Header currentPath="/courses" />
      <main className="min-h-screen bg-slate-950 text-white pt-6 pb-8 px-4 sm:pt-10 sm:pb-10 sm:px-6 xl:mt-20 mt-48 ">
        <div className="max-w-xl sm:max-w-2xl md:max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleBackToCourses}
            className="mb-4 text-slate-400 hover:text-white hover:bg-slate-800 group transition-all duration-200 inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm sm:text-base">Back to Courses</span>
          </Button>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full sm:h-56 md:h-64">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Shield className="w-16 h-16 text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 group">
                    <Image
                      src={course.language.image}
                      alt={course.language.name}
                      fill
                      className="rounded-full object-cover ring-2 ring-white/20 transition-all duration-200 group-hover:ring-white/40"
                    />
                  </div>
                  <span className="text-slate-300 text-lg font-medium">
                    {course.language.name}
                  </span>
                </div>
                <Badge variant="secondary" className="w-fit bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                  {isCourseType(course.type) ? CourseType[course.type] : "Course"}
                </Badge>
              </div>

              <h1 className="text-2xl font-extrabold mb-6 tracking-tight sm:text-3xl md:text-4xl text-white">
                {course.name}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
                  <Globe className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>{course.language.name} Course</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
                  <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>Weekly Sessions</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
                  <Users className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>Active Learners</span>
                </div>
              </div>
              {/* 
              {course.progress && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Course Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2 bg-slate-700" indicatorClassName="bg-blue-500" />
                </div>
              )} */}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors w-full sm:w-auto relative overflow-hidden group disabled:opacity-70"
                  onClick={() => handleStartLearning(course._id)}
                  disabled={isStarting}
                >
                  {isStarting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Starting...
                    </div>
                  ) : (
                    <>
                      Start Learning
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors w-full sm:w-auto"
                  onClick={handleBackToCourses}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Container>
  );
}

export default CoursePageID;
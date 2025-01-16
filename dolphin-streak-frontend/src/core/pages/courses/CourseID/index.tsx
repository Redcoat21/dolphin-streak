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
  Users,
  Sparkles,
  GraduationCap,
  Trophy,
  ArrowRight
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
      <main className="min-h-screen bg-slate-950 text-white pt-6 pb-8 px-4 sm:pt-10 sm:pb-10 sm:px-6 xl:mt-20 mt-32">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleBackToCourses}
            className="mb-6 text-slate-400 hover:text-white hover:bg-slate-800 group transition-all duration-200 inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm sm:text-base text-slate-200">Back to Courses</span>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Course Content */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-48 sm:h-64 md:h-80 w-full">
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
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      {/* <Badge variant="secondary" className="mb-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                        {isCourseType(course.type) ? CourseType[course.type] : "Course"}
                      </Badge> */}
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
                        {course.name}
                      </h1>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 text-slate-200">
                      <Globe className="w-5 h-5 text-blue-400 shrink-0" />
                      <span>{course.language.name} Course</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-200">
                      <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                      <span>Weekly Sessions</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-200">
                      <Users className="w-5 h-5 text-blue-400 shrink-0" />
                      <span>Active Learners</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-slate-200">
                        <GraduationCap className="w-5 h-5 text-blue-400" />
                        Course Overview
                      </h3>
                      <p className="text-slate-200 leading-relaxed">
                        Master {course.language.name} through our comprehensive curriculum. This course is designed to take you from beginner to proficient speaker through interactive lessons and practical exercises.
                      </p>
                    </div>

                    {/* <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-slate-200">
                        <Trophy className="w-5 h-5 text-blue-400" />
                        What You'll Learn
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-200">
                        {course.levels.map((level) => (
                          <li key={level._id} className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                            <span>{level.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Actions Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-12 h-12">
                      <Image
                        src={course.language.image}
                        alt={course.language.name}
                        fill
                        className="rounded-full object-cover ring-2 ring-white/20"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {course.language.name}
                      </h3>
                      <p className="text-sm text-slate-400">Language Course</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 relative overflow-hidden group"
                      onClick={() => handleStartLearning(course._id)}
                      disabled={isStarting}
                    >
                      {isStarting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Starting...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          Start Learning
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-slate-700 text-slate-800 hover:bg-slate-800 hover:text-white transition-all duration-200"
                      onClick={handleBackToCourses}
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-slate-800">
                    <h4 className="text-sm font-medium text-slate-400 mb-4">Course Features</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-slate-200">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span>Interactive Lessons</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-200">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>Community Support</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-200">
                        <Trophy className="w-4 h-4 text-blue-400" />
                        <span>Achievement Badges</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </Container>
  );
}

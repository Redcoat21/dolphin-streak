import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface LoadingSkeletonProps {
  count?: number; // Number of skeleton cards to display
  gridClassName?: string; // Tailwind classes for the grid layout
  cardClassName?: string; // Tailwind classes for the card styling
  type?: "course" | "course-detail" | "lesson"; // Type of skeleton to display
}

export const LoadingSkeleton = ({
  count = 6,
  cardClassName = "cursor-pointer",
  type = "course",
}: LoadingSkeletonProps) => {
  const renderCourseSkeleton = () => (
    <Card
      className={`group relative overflow-hidden bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-300 ${cardClassName}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
      <div className="relative h-48 w-full overflow-hidden">
        <Skeleton className="h-full w-full transform group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-6 w-6 rounded-full ring-2 ring-white/20" />
          <Skeleton className="h-4 w-20 bg-blue-500/20" />
        </div>
        <Skeleton className="h-6 w-48 mb-1" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-1 w-full bg-slate-700" />
      </div>
    </Card>
  );


  const renderCourseDetailSkeleton = () => (
    <div className="space-y-8">
      {/* Course Header Skeleton */}
      <div className="h-[300px] rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <Skeleton className="h-full w-full" />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-8 w-8 rounded-full ring-2 ring-white/20" />
            <Skeleton className="h-6 w-24 bg-blue-500/20" />
          </div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>

      {/* Lesson Types Skeleton */}
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => {
            const key = `lesson-type-${i}`;
            return (
            <Skeleton key={key} className="h-6 w-24 bg-purple-500/20" />
          )})}
        </div>
      </div>

      {/* Course Levels Skeleton */}
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid gap-4">
          {Array.from({ length: count }).map((_, i) => {
            const key = `level-${i}`;
            return (
              <Card key={key} className="bg-slate-900 border-slate-800">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <Skeleton className="h-6 w-48 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-24 bg-blue-500/20" />
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );


  const renderLessonSkeleton = () => (
    <Card className={cardClassName}>
      <div className="p-4">
        <Skeleton className="h-6 w-48" /> {/* Lesson Title */}
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" /> {/* Lesson Content */}
          <Skeleton className="h-6 w-full" /> {/* Lesson Content */}
        </div>
      </div>
    </Card>
  );

  const renderSkeleton = () => {
    switch (type) {
      case "course":
        return renderCourseSkeleton();
      case "course-detail":
        return renderCourseDetailSkeleton();
      case "lesson":
        return renderLessonSkeleton();
      default:
        return renderCourseSkeleton();
    }
  };

  return (
    Array.from({ length: count }).map((_, i) => (
      renderSkeleton()
    ))
  );
};
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/core/components/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/core/stores/authStore";
import { trpc } from "@/utils/trpc";
import { Header } from "../../dasboard/components/Header";
import Image from "next/image";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export function CoursePageID() {
  const router = useRouter();
  const { getAccessToken } = useAuthStore();
  const accessToken = getAccessToken();
  const params = useParams();
  const courseId = params?.id as string;
  const { data: courseData, isLoading } = trpc.course.getCourseById.useQuery({
    id: courseId,
    accessToken: accessToken || "",
  });

  const course = courseData?.data;

  const LessonTypeIcon = ({ type }: { type: number }) => {
    switch (type) {
      case 0:
        return <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">Multiple Choice</Badge>;
      case 1:
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400">Essay</Badge>;
      case 2:
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">Fill in Blanks</Badge>;
      case 3:
        return <Badge variant="secondary" className="bg-red-500/20 text-red-400">Voice</Badge>;
      default:
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Writing</Badge>;
    }
  };

  return (
    <Container>
      <Header currentPath={`/course/${courseId}`} />

      <main className="min-h-screen bg-slate-950 text-white pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white mb-6 text-white"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>

          {course && (
            <>
              {/* Course Header */}
              <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <Image
                  src={course.thumbnail}
                  alt={course.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center gap-2 mb-4">
                    <Image
                      src={course.language.image}
                      alt={course.language.name}
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-white/20"
                    />
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      {course.levels.length} Levels
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-2">{course.name}</h1>
                  <p className="text-slate-300">{course.language.name}</p>
                </div>
              </div>

              {/* Course Content */}
              <div className="grid gap-8">
                {/* Lesson Types */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Available Lesson Types</h2>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4].map((type) => (
                      <LessonTypeIcon key={type} type={type} />
                    ))}
                  </div>
                </div>

                {/* Course Levels */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Course Levels</h2>
                  <div className="grid gap-4">
                    {course.levels.map((level, index) => (
                      <Card
                        key={level._id}
                        className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-300"
                      >
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-1 text-white">{level.name}</h3>
                            <p className="text-sm text-white">Chapter {index + 1}</p>
                          </div>
                          <Button
                            variant="default"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => router.push(`/course/${course._id}/levels/${level._id}`)}
                          >
                            Start Level
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {isLoading && <LoadingSkeleton count={3} type={'course-detail'} />}
        </div>
      </main>
    </Container>
  );
}

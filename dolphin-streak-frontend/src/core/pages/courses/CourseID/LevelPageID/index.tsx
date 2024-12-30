import { useMediaQuery } from "@/hooks/use-media-query";
import { Container } from "@/core/components/container";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { Header } from "@/core/pages/dasboard/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { useCallback } from "react";
import { useAuthStore } from "@/core/stores/authStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";

export function LevelPageID() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  const levelId = params?.levelId as string;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { getAccessToken } = useAuthStore();
  const accessToken = getAccessToken();
  const { data, isLoading, isError, refetch } = trpc.levels.getLevelDetail.useQuery({
    levelId,
    accessToken: accessToken || "",
  });

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <Container>
      <Header currentPath={`/course/${courseId}/levels/${levelId}`} />
      <main className="min-h-screen bg-slate-950 text-white pt-20 pb-8 px-4 mt-24">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white mb-6 group"
            onClick={handleBack}
          >
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Course
          </Button>

          {isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load level data. Please try again.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <LoadingSkeleton />
          ) : data?.data ? (
            <div className="space-y-8">
              {/* Level Header */}
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">{data.data.level.name}</h1>
                <p className="text-slate-400">
                  Complete all questions to progress to the next level
                </p>
              </div>

              {/* Progress Bar */}
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="py-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-slate-400">0/{data.data.questions.length} Questions</span>
                    </div>
                    <Progress value={0} className="h-2 bg-slate-800" />
                  </div>
                </CardContent>
              </Card>

              {/* Questions List */}
              <div className="grid gap-4">
                {data.data.questions.map((question, index) => (
                  <Card
                    key={question._id}
                    className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-medium flex items-center gap-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                          {index + 1}
                        </span>
                        <span>
                          {question.question?.text || `Question ${index + 1}`}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {question.answerOptions.map((option: string, optionIndex: number) => (
                          <Button
                            key={optionIndex}
                            variant="outline"
                            className="justify-start border-slate-800 hover:border-blue-500 hover:bg-blue-500/10"
                          >
                            <span className="mr-2 text-slate-500">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            {option}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </Container>
  );
}
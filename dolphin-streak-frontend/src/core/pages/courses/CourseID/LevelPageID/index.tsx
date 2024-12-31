import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, AlertCircle, Mic, PenSquare, CheckCircle, XCircle, Book, ArrowRight, Flag } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import { useAuthStore } from '@/core/stores/authStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { Header } from '@/core/pages/dasboard/components/Header';
import { Container } from '@/core/components/container';
import { useParams } from 'next/navigation';

export function LevelPageID() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  const levelId = params?.levelId as string;
  const { getAccessToken } = useAuthStore();
  const accessToken = getAccessToken();
  const { data, isLoading, isError } = trpc.levels.getLevelDetail.useQuery({
    levelId,
    accessToken: accessToken || "",
  });

  const { mutate: startLevel, isPending: isStartingLevel } = trpc.levels.startLevel.useMutation({
    onSuccess: (data) => {
      const { sessionId } = data;
      router.push(`/course/${courseId}/levels/${levelId}/question/1?sessionId=${sessionId}`);
    },
    onError: () => {
      console.error('Failed to start level');
    },
  });

  const handleBack = useCallback(() => {
    router.push(`/course/${courseId}`);
  }, [router, courseId]);

  const handleConfirm = useCallback(() => {
    startLevel({ levelId, accessToken: accessToken || "" });
  }, [startLevel, levelId, accessToken]);

  return (
    <Container>
      <Header currentPath={`/course/${courseId}/levels/${levelId}`} />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-8 bg-slate-900/50 p-4 rounded-xl backdrop-blur-sm border border-slate-800">
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-white group flex items-center gap-2 transition-all duration-200"
              onClick={handleBack}
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Course</span>
            </Button>
          </div>
          {/* Error State */}
          {isError && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>Failed to load level content. Please try again.</AlertDescription>
            </Alert>
          )}
          {/* Loading State */}
          {isLoading ? (
            <LoadingSkeleton count={1} type="course-detail" />
          ) : (
            <>
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <div className="text-center space-y-4">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        Ready to Begin?
                      </h1>
                      <p className="text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
                        This level contains {data?.questionsLength} questions.
                        Take your time and answer carefully. Good luck!
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <Button
                        size="lg"
                        className="w-full max-w-md h-14 bg-gradient-to-r from-blue-500 to-blue-600 
                        hover:from-blue-600 hover:to-blue-700 text-lg font-medium
                        transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl
                        hover:shadow-blue-500/20"
                        onClick={handleConfirm}
                        disabled={isStartingLevel}
                      >
                        {isStartingLevel ? "Starting..." : "Start Level"}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </Container>
  );
}
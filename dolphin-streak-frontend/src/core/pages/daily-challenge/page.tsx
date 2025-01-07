import { useEffect, useState } from "react";
import { Container } from "@/core/components/container";
import { Header } from "../dasboard/components/Header";
import { trpc } from "@/utils/trpc";
import { useAuthStore } from "@/core/stores/authStore";
import { BookOpen, Calendar, Clock, Trophy, ArrowRight } from "lucide-react";
import { LoadingSkeleton } from "../courses/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { formatDate } from "@/utils/generic";

export function Challenge() {
  const { getAccessToken } = useAuthStore();
  const accessToken = getAccessToken();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const { data: languagesData } = trpc.language.getLanguages.useQuery({
    accessToken: accessToken || "",
  });

  useEffect(() => {
    if (languagesData?.data && languagesData.data.length > 0) {
      setSelectedLanguage(languagesData.data[0]._id);
    }
  }, [languagesData]);

  const { data: challengeData, isLoading, error } = trpc.daily.getDailyFromLanguage.useQuery({
    accessToken: accessToken || "",
    language: selectedLanguage,
  });

  const { mutate: startDailyChallenge, isPending: isStartingChallenge } = trpc.daily.startDaily.useMutation({
    onSuccess: (data) => {
      if (data?.data?.dailyId) {
        router.push(`/daily-challenge/session/${data.data.dailyId}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to start the daily challenge.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "An error occurred while starting the challenge.",
        variant: "destructive",
      });
    }
  });

  const handleStartChallenge = async () => {
    if (!selectedLanguage) {
      toast({
        title: "Error",
        description: "Please select a language to start the challenge.",
        variant: "destructive",
      });
      return;
    }
    startDailyChallenge({
      accessToken: accessToken || "",
      languageId: selectedLanguage,
    });
  };

  return (
    <Container>
      <Header
        currentPath="/daily-challenge"
        languageDropdown={true}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-24 pb-8 px-4 md:mt-8 mt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-10 h-10 text-yellow-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Daily Challenge
              </h1>
            </div>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Push your boundaries and improve your skills with our daily language challenges.
              Complete them to earn special rewards and track your progress!
            </p>
          </div>

          {/* Challenge Content */}
          {isLoading ? (
            <div className="max-w-2xl mx-auto">
              <LoadingSkeleton count={1} />
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-slate-800/50 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                Error fetching challenge
              </h3>
              <p className="text-slate-500">
                Please try again later or refresh the page.
              </p>
            </div>
          ) : challengeData?.data ? (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-slate-800/50 backdrop-blur border-slate-700 hover:border-slate-600 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                          {challengeData.data.course.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-slate-300 flex items-center gap-2">
                        {challengeData.data.course.language.image && (
                          <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src={challengeData.data.course.language.image}
                              alt={challengeData.data.course.language.name}
                              fill
                              className="object-cover"
                              sizes="24px"
                            />
                          </div>
                        )}
                        <span>{challengeData.data.course.language.name} Challenge</span>
                      </CardDescription>
                    </div>
                    {challengeData.data.course.thumbnail && (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={challengeData.data.course.thumbnail}
                          alt={challengeData.data.course.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Available until:</span>
                    </div>
                    <span className="font-medium text-slate-300">
                      {formatDate(challengeData.data.dailyChallenge.expiresAt)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={handleStartChallenge}
                      disabled={isStartingChallenge}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isStartingChallenge ? (
                          <>
                            <Clock className="w-5 h-5 animate-spin" />
                            <span>Starting Challenge...</span>
                          </>
                        ) : (
                          <>
                            <span>Start Today's Challenge</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-800/50 rounded-lg max-w-2xl mx-auto">
              <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                No Challenge Available Today
              </h3>
              <p className="text-slate-500">
                You've completed today's challenges! Check back tomorrow for new ones.
              </p>
            </div>
          )}
        </div>
      </main>
    </Container>
  );
}
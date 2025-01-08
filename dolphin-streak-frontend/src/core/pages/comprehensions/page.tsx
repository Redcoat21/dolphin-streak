import React, { useState, useEffect } from 'react';
import { Container } from "@/core/components/container";
import { Button } from 'src/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Clock, BookOpen } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/utils/trpc';
import { useAuthStore } from "@/core/stores/authStore";
import { Header } from "../dasboard/components/Header";
import { Textarea } from 'src/components/ui/textarea';
import { QuestionType } from '@/server/types/questions';


export function ComprehensionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { getAccessToken } = useAuthStore();
  const accessToken = getAccessToken();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [comprehensionSessionId, setComprehensionSessionId] = useState<string | null>(null);
  const [questionData, setQuestionData] = useState<any | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  // Fetch languages data
  const { data: languagesData } = trpc.language.getLanguages.useQuery({
    accessToken: accessToken || "",
  });

  // Set selectedLanguage to the first language if it exists
  useEffect(() => {
    if (languagesData?.data && languagesData.data.length > 0) {
      setSelectedLanguage(languagesData.data[0]._id);
    }
  }, [languagesData]);

  // Fetch comprehensions data
  const { data: comprehensionsData, isLoading } = trpc.comprehension.getAllComprehensions.useQuery({
    accessToken: accessToken || "",
    language: selectedLanguage,
  }, {
    enabled: !!selectedLanguage,
  });

  // Filter comprehensions based on search query
  const filteredComprehensions = comprehensionsData?.data?.filter((comp: any) =>
    comp.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const startComprehensionMutation = trpc.comprehension.startComprehension.useMutation({
    onSuccess: (data) => {
      if(data?.data){
        setComprehensionSessionId(data.data.comprehensionId);
        setTotalQuestions(data.data.totalQuestions);
        const expiresAt = new Date(data.data.expiresAt).getTime();
        const now = new Date().getTime();
        setTimeLeft(Math.floor((expiresAt - now) / 1000));
        toast({
          title: "Comprehension Started",
          description: "You can now start the comprehension challenge",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getQuestionMutation = trpc.comprehension.getQuestionBySessionId.useMutation({
    onSuccess: (data) => {
      if(data?.data){
        setQuestionData(data.data);
        setQuestionIndex(data.data.questionIndex);
        setScore(data.data.score);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const submitAnswerMutation = trpc.comprehension.postSubmitAnswer.useMutation({
    onSuccess: (data) => {
      if(data?.data){
        setSuggestion(data.data.suggestion);
        if (data.data.isLatest) {
          toast({
            title: "Comprehension Completed",
            description: "You have completed the comprehension challenge",
          });
          router.push("/dashboard");
        } else {
          getQuestionMutation.mutate({ accessToken: accessToken || "", comprehensionSessionId: comprehensionSessionId! });
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    let intervalId: any;
    if (timeLeft && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime ? prevTime - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleStartComprehension = async (languageId: string) => {
    setIsSubmitting(true);
    await startComprehensionMutation.mutateAsync({ accessToken: accessToken || "", languageId: languageId });
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    setIsSubmittingAnswer(true);
    let answer = "";
     if (questionData?.question?.questionType === QuestionType.ESSAY) {
      answer = textAnswer;
    }
    await submitAnswerMutation.mutateAsync({
      accessToken: accessToken || "",
      comprehensionSessionId: comprehensionSessionId!,
      answer: answer,
    });
    setSelectedAnswer(null);
    setTextAnswer("");
    setIsSubmittingAnswer(false);
  };

  useEffect(() => {
    if (comprehensionSessionId) {
      getQuestionMutation.mutate({ accessToken: accessToken || "", comprehensionSessionId: comprehensionSessionId });
    }
  }, [comprehensionSessionId]);

  return (
    <Container>
      <Header
        currentPath="/comprehensions"
        languageDropdown={true}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      <main className="min-h-screen bg-slate-950 text-white pt-24 pb-8 px-4 md:mt-8 mt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold">Comprehension Challenges</h1>
            </div>
            <p className="text-slate-400">Test your language comprehension skills</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 relative">
            <Input
              type="text"
              placeholder="Search comprehension challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Comprehensions Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Add your loading skeleton component here */}
            </div>
          ) : filteredComprehensions && filteredComprehensions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComprehensions.map((comprehension: any) => (
                <Card key={comprehension._id} className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle>{comprehension.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>30 minutes</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleStartComprehension(comprehension._id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      Start Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                No comprehension challenges found
              </h3>
              <p className="text-slate-500">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Check back later for new challenges"}
              </p>
            </div>
          )}
        {comprehensionSessionId && (
          <Card className="w-full mt-4">
            <CardHeader>
              <CardTitle>
                {questionIndex !== null && totalQuestions !== null ? `Question ${questionIndex + 1} of ${totalQuestions}` : "Loading..."}
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {timeLeft !== null ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}` : "Loading..."}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {questionData?.question?.comprehension?.passage && (
                <div className="mb-4">
                  <p className="font-medium">Passage:</p>
                  <p>{questionData.question.comprehension.passage}</p>
                </div>
              )}
              {questionData?.question?.questionType === QuestionType.ESSAY && (
                <div className="flex flex-col gap-2">
                  <p className="font-medium">{questionData.question.question.text}</p>
                  <Textarea
                    placeholder="Your answer here"
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                  />
                </div>
              )}
              {suggestion && (
                <div className="mb-4">
                  <p className="font-medium">AI Suggestion:</p>
                  <p>{suggestion}</p>
                </div>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isSubmittingAnswer}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6"
              >
                {isSubmitting || isSubmittingAnswer ? "Submitting..." : "Submit Answer"}
              </Button>
            </CardContent>
          </Card>
        )}
        </div>
      </main>
    </Container>
  );
}
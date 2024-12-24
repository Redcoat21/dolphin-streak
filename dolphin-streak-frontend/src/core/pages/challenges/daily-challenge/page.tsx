import { useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Timer, ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Container } from "@/core/components/container";
import { useRouter } from 'next/router';
import { Header } from "../../dasboard/components/Header";
import { usePathname } from "next/navigation";

export const DailyChallengePage = () => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  // Simulate challenge progress
  const handleStartChallenge = useCallback(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          return 100;
        }
        return prev + 20;
      });
    }, 1000);
  }, []);

  return (
    <Container>
      <div className="min-h-screen bg-[#0b1120] text-white">
        <Header currentPath={pathname} />
        <div className="max-w-4xl mx-auto space-y-8 mt-32 px-4 sm:px-6 lg:px-8">

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl text-white">Today's Challenge</CardTitle>
                  <CardDescription className="text-gray-400">
                    Complete the challenge to earn rewards
                  </CardDescription>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500 mt-4 sm:mt-0" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Timer className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Time remaining: 23:45:12</span>
                  </div>
                  <span className="text-blue-400 mt-2 sm:mt-0">500 XP</span>
                </div>

                <Progress
                  value={progress}
                  className="h-2 bg-gray-800"
                />
              </div>

              {isCompleted ? (
                <Alert className="bg-green-900/50 border-green-800 text-green-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Challenge Completed!</AlertTitle>
                  <AlertDescription>
                    You've earned 500 XP. Come back tomorrow for a new challenge!
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-300">
                    Today's challenge: Complete 5 coding exercises focused on array manipulation
                    and algorithmic thinking.
                  </p>
                  <Button
                    variant="custom-blue"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center space-x-2"
                    onClick={handleStartChallenge}
                    disabled={progress > 0 && progress < 100}
                  >
                    <span>{progress === 0 ? "Start Challenge" : "Continue Challenge"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Previous Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "Dec 23", completed: true, xp: 500 },
                  { date: "Dec 22", completed: true, xp: 500 },
                  { date: "Dec 21", completed: false, xp: 0 },
                ].map((challenge, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-800/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`h-2 w-2 rounded-full ${challenge.completed ? "bg-green-500" : "bg-red-500"
                        }`} />
                      <span className="text-gray-300">{challenge.date}</span>
                    </div>
                    <span className={`${challenge.completed ? "text-blue-400" : "text-gray-500"
                      } mt-2 sm:mt-0`}>
                      {challenge.completed ? `+${challenge.xp} XP` : "Missed"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

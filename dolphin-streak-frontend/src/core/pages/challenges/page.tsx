import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import router from 'next/router';

interface ChallengeProps {
  onContinue?: () => void;
  onBack?: () => void;
}

const Challenge: React.FC<ChallengeProps> = ({ onContinue, onBack }) => {
  return (
    <div className="min-h-screen bg-[#080e1e]">
      {/* Header */}
      <div className="flex items-center bg-[#0a84ff] p-4 text-white">
        <button 
          onClick={() => router.push("/")}
          className="hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h3 className="flex-grow text-center text-lg font-semibold">
          Daily Challenge
        </h3>
      </div>

      {/* Content */}
      <div className="p-5">
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="flex flex-col items-center justify-center space-y-2 pt-6">
            <div className="space-y-2 text-center">
              <h2 className="text-white font-cambria text-5xl leading-tight">
                Are you sure
              </h2>
              <h2 className="text-white font-cambria text-5xl leading-tight">
                you want to take the
              </h2>
              <h2 className="text-white font-cambria text-5xl leading-tight">
                Daily Challenge?
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Button at Bottom */}
      <div className="fixed bottom-5 left-0 right-0 px-10">
        <Button 
          className="w-full bg-[#5B7BFE] hover:bg-[#4A6AED] text-white"
          onClick={() => router.push("/challenge/daily-challenge")}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Challenge;
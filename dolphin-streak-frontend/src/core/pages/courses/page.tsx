import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import router from 'next/router';

interface CourseProps {
  onContinue?: () => void;
  onBack?: () => void;
  currentDay?: number;
}

const Course: React.FC<CourseProps> = ({ 
  onContinue, 
  onBack,
  currentDay = 30 
}) => {
  return (
    <div className="min-h-screen bg-[#080E1E]">
      {/* Header */}
      <div className="flex items-center bg-[#0A84FF] p-4 text-white">
        <button 
          onClick={() => router.push("/")}
          className="hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h3 className="flex-grow text-center text-lg font-semibold">
          Course
        </h3>
      </div>

      {/* Content */}
      <div className="p-5">
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="flex flex-col items-center justify-center space-y-2 pt-6">
            <div className="space-y-2 text-center">
              <h2 className="text-white font-arial text-5xl leading-tight">
                Today is Day {currentDay}
              </h2>
              <h2 className="text-white font-arial text-5xl leading-tight">
                Do you want to
              </h2>
              <h2 className="text-white font-arial text-5xl leading-tight">
                continue?
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Button at Bottom */}
      <div className="fixed bottom-5 left-0 right-0 px-10">
        <Button 
          className="w-full bg-[#0A84FF] hover:bg-[#0973e6] text-white"
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Course;
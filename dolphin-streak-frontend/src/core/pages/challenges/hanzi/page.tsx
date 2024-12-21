import React from 'react';
import { Button } from '@/components/ui/button';
import router from 'next/router';

interface HanziProps {
  courseNumber?: number;
  currentChapter?: number;
  totalChapters?: number;
  character?: string;
  onContinue?: () => void;
}

const Hanzi: React.FC<HanziProps> = ({
  courseNumber = 10,
  currentChapter = 8,
  totalChapters = 10,
  character = "小",
  onContinue
}) => {
  return (
    <div className="min-h-screen bg-[#0B1121] flex flex-col">
      {/* Header */}
      <div className="bg-[#0A84FF] text-white p-4 text-lg font-bold">
        Course {courseNumber} - Chapter {currentChapter}/{totalChapters}
      </div>

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center">
        <div className="relative w-[200px] h-[200px] bg-[#141A2B] border-2 border-[#1B2335] flex justify-center items-center">
          {/* Horizontal Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#A0A0A0]" />
          
          {/* Character */}
          <div className="text-[10rem] text-white relative z-10">
            {character}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-5">
        <Button 
          className="w-full mx-auto bg-[#0A84FF] hover:bg-[#0973e6] text-white text-lg py-6 rounded-lg"
          onClick={() => router.push("/")}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Hanzi;
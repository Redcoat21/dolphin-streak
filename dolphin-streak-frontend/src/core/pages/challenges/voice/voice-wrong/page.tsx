import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import router from 'next/router';

interface VoiceFailProps {
  courseNumber?: number;
  currentChapter?: number;
  totalChapters?: number;
  chineseText?: string;
  pinyinText?: string;
  onContinue?: () => void;
}

const VoiceFail: React.FC<VoiceFailProps> = ({
  courseNumber = 10,
  currentChapter = 9,
  totalChapters = 10,
  chineseText = "我叫小明，今年二十岁。",
  pinyinText = "Wǒ jiào Xiǎomíng, jīnnián èrshí suì.",
  onContinue
}) => {
  return (
    <div className="min-h-screen bg-[#0B1121] flex flex-col">
      {/* Header */}
      <div className="bg-[#0A84FF] text-white p-4 text-lg font-bold text-center">
        Course {courseNumber} - Chapter {currentChapter}/{totalChapters}
      </div>

      {/* Subtitle */}
      <div className="mt-5 px-4">
        <div className="text-lg text-white text-center">
          {chineseText}
          <span className="block mt-2 text-sm text-[#A0A0A0]">
            {pinyinText}
          </span>
        </div>
      </div>

      {/* Mic Container */}
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-[#740000] p-5 rounded-lg">
          <Mic className="w-24 h-24 text-white" />
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-5">
        <Button 
          className="w-full bg-[#0A84FF] hover:bg-[#0973e6] text-white text-lg py-6 rounded-lg"
          onClick={() => router.push("/challenge/voice")}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default VoiceFail;
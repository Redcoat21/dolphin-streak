import React from 'react';
import { Button } from '@/components/ui/button';

interface Option {
  text: string;
  isCorrect?: boolean;
}

interface MultipleChoiceCorrectProps {
  courseNumber?: number;
  currentChapter?: number;
  totalChapters?: number;
  question?: string;
  options?: Option[];
  onContinue?: () => void;
}

const MultipleChoiceCorrect: React.FC<MultipleChoiceCorrectProps> = ({
  courseNumber = 10,
  currentChapter = 6,
  totalChapters = 10,
  question = "How do you say thank you in Mandarin?",
  options = [
    { text: "你好" },
    { text: "谢谢", isCorrect: true },
    { text: "再见" },
    { text: "对不起" }
  ],
  onContinue
}) => {
  return (
    <div className="min-h-screen bg-[#0B1121] flex flex-col">
      {/* Header */}
      <div className="bg-[#0A84FF] text-white p-4 text-lg font-bold text-center">
        Course {courseNumber} - Chapter {currentChapter}/{totalChapters}
      </div>

      {/* Question */}
      <div className="text-xl text-white p-5 text-center">
        {question}
      </div>

      {/* Options Grid */}
      <div className="flex-grow px-5">
        <div className="grid grid-cols-2 gap-5">
          {options.map((option, index) => (
            <div
              key={index}
              className={`
                p-5 rounded-lg text-lg font-normal text-white
                flex items-center justify-center min-h-[80px]
                ${option.isCorrect 
                  ? 'bg-[#3bc400]' 
                  : 'bg-[#1B2335] hover:bg-[#0A84FF] cursor-pointer'
                }
              `}
            >
              {option.text}
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-5 flex justify-center">
        <Button 
          className="w-full bg-[#0A84FF] hover:bg-[#0973e6] text-white text-lg py-6 rounded-lg"
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MultipleChoiceCorrect;
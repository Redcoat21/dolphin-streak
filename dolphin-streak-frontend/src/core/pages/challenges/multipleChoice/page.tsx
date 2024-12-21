import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MultipleChoiceProps {
  courseNumber?: number;
  currentChapter?: number;
  totalChapters?: number;
  question?: string;
  options?: string[];
  onContinue?: (selectedOption: string | null) => void;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  courseNumber = 10,
  currentChapter = 6,
  totalChapters = 10,
  question = "How do you say thank you in Mandarin?",
  options = ["你好", "谢谢", "再见", "对不起"],
  onContinue
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

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
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`
                p-5 rounded-lg text-lg font-normal text-white
                transition-colors duration-300
                flex items-center justify-center min-h-[80px]
                ${selectedOption === option 
                  ? 'bg-[#0A84FF]' 
                  : 'bg-[#1B2335] hover:bg-[#0A84FF]'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-5 flex justify-center">
        <Button 
          className="w-full bg-[#0A84FF] hover:bg-[#0973e6] text-white text-lg py-6 rounded-lg"
          onClick={() => onContinue?.(selectedOption)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MultipleChoice;
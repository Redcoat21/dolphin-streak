import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import router from 'next/router';

interface ComprehensionFeedbackProps {
  score?: number;
  maxScore?: number;
  feedback?: string;
  regards?: string;
  onContinue?: () => void;
  onBack?: () => void;
}

const ComprehensionFeedback: React.FC<ComprehensionFeedbackProps> = ({
  score = 80,
  maxScore = 100,
  feedback = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, veniam perferendis consectetur corrupti fuga quidem debitis, molestiae mollitia placeat hic minima tempora officia blanditiis! Sint inventore ea repudiandae sunt, repellendus ducimus necessitatibus quaerat ut officiis laboriosam.",
  regards = "Dolphin Streak",
  onContinue,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-[#080e1e] font-fredoka">
      {/* Header */}
      <div className="bg-[#0a84ff] p-4 text-white relative">
        <button 
          onClick={() => router.push("/")}
          className="absolute left-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-center text-xl font-bold">
          Comprehension
        </h1>
      </div>

      {/* Main Content */}
      <Card className="bg-[#0c1221] border-none rounded-none shadow-lg">
        <CardContent className="p-5">
          <div className="text-white">
            {/* Title and Score */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium mb-3">
                Thank you for your Hardwork
              </h2>
              <div className="text-4xl font-bold">
                {score}/{maxScore}
              </div>
            </div>

            {/* Feedback Section */}
            <div className="mt-6 text-left">
              <h3 className="text-xl font-bold mb-3">
                Feedback
              </h3>
              <p className="text-[#cfcfcf] text-sm leading-relaxed">
                {feedback}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 text-left text-sm">
              <p>Our Regards,</p>
              <p className="mt-2 font-bold">{regards}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Button at Bottom */}
      <div className="fixed bottom-5 left-0 right-0 px-5">
        <Button 
          className="w-full bg-[#0a84ff] hover:bg-[#006fdd] text-white font-bold text-lg"
          onClick={() => router.push("/")}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ComprehensionFeedback;
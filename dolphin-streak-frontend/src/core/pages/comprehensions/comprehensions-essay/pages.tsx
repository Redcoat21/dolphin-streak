import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import router from 'next/router';
// import { Textarea } from '@/components/ui/textarea';

interface ComprehensionEssayProps {
  maxWords?: number;
  topic?: string;
  placeholder?: string;
  onSubmit?: (text: string) => void;
}

const ComprehensionEssay: React.FC<ComprehensionEssayProps> = ({
  maxWords = 1000,
  topic = "My Family",
  placeholder = "我的家",
  onSubmit
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [text, setText] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText(newText);
    setWordCount(newText.split(/\s+/).filter(word => word !== '').length);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(text);
    }
  };

  return (
    <div className="min-h-screen bg-[#080e1e] font-fredoka">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#0a84ff] py-4 text-center text-white font-bold text-xl z-10">
        Comprehension
      </div>

      {/* Main Content */}
      <div className="pt-20 px-5">
        <Card className="bg-[#0c1221] border-none">
          <CardContent className="p-6">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-6">
                Essay Topic: {topic}
              </h2>

              {/* Text Area Container */}
              <div className="relative bg-[#12192c] rounded-lg p-4">
                <div className="absolute top-3 right-4 text-sm text-gray-400">
                  {wordCount}/{maxWords}
                </div>
                
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  placeholder={placeholder}
                  className="min-h-[300px] w-full bg-transparent border-none text-white resize-none focus:ring-0 focus:ring-offset-0 placeholder:text-gray-400"
                />
              </div>

              {/* Submit Button */}
              <Button 
                className="w-full mt-6 bg-[#0a84ff] hover:bg-[#0973e6] text-white font-bold text-lg"
                onClick={() => router.push("/comprehension/feedback")}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensionEssay;
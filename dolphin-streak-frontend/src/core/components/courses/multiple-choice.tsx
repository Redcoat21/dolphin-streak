import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MultipleChoicePage() {
  const data = [
    {
      question: 'How do you say "thank you" in Mandarin?',
      options: ["你好", "谢谢", "再见", "对不起"],
      answer: "谢谢",
    },
  ];

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
  };

  const handleContinue = () => {
    setIsAnswered(true);
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Multiple Choice</h1>
        {data.map((question, index) => (
          <div key={index}>
            <h2 className="text-2xl font-bold mb-2">{question.question}</h2>
            <div className="grid grid-cols-2 gap-4">
              {question.options.map((option) => (
                <div
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    "p-4 rounded cursor-pointer transition-colors",
                    selectedAnswer === option
                      ? selectedAnswer === question.answer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                >
                  <p>{option}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {isAnswered && (
          <div id="result" className="mt-4">
            {selectedAnswer === data[0].answer ? (
              <p className="text-green-500">Correct!</p>
            ) : (
              <p className="text-red-500">Incorrect.</p>
            )}
          </div>
        )}
        <Button
          onClick={handleContinue}
          disabled={!selectedAnswer || isAnswered}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

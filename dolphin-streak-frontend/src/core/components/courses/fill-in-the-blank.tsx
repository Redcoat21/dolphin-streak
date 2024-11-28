import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FillInTheBlankPage() {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const correctAnswer = "20"; // Replace with the actual correct answer

  const checkAnswer = () => {
    if (answer.trim() === correctAnswer) {
      setFeedback("Correct!");
    } else {
      setFeedback("Incorrect. Try again.");
    }
  };

  return (
    <div className="bg-gray-800 text-white h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6 bg-gray-700 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Fill In The Blanks</h1>
        <div className="bg-blue-500 p-4 rounded-lg mb-4">
          <p className="text-xl font-medium">Course 10 - Chapter 7/10</p>
        </div>
        <div className="bg-gray-600 p-4 rounded-lg mb-4">
          <p className="text-3xl font-bold">
            我叫小明，今年
            <Input
              type="text"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded-lg w-16 text-center inline-block mx-2"
            />
            岁。
          </p>
          <p className="text-sm">Wǒ jiào Xiǎomíng, jīnnián èrshí suì.</p>
        </div>
        <Button
          onClick={checkAnswer}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Continue
        </Button>
        {feedback && (
          <div className="mt-4">
            <p
              className={
                feedback === "Correct!" ? "text-green-500" : "text-red-500"
              }
            >
              {feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

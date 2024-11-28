import { useState } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionButton } from "./subcomponents/OptionButton";

const steps = [
  {
    title: "What Is Your Mother Language",
    options: [
      { id: "english", label: "English", flag: "🇺🇸" },
      { id: "indonesian", label: "Indonesian", flag: "🇮🇩" },
      { id: "chinese", label: "Chinese", flag: "🇨🇳" },
    ],
  },
  {
    title: "Which language would you like to learn?",
    options: [
      { id: "english", label: "English", flag: "🇺🇸" },
      { id: "indonesian", label: "Indonesian", flag: "🇮🇩" },
      { id: "chinese", label: "Chinese", flag: "🇨🇳" },
    ],
  },
  {
    title: "How much do you know about Chinese",
    options: [
      { id: "beginner", label: "I am a Beginner, I am Just Starting Out" },
      {
        id: "intermediate",
        label: "I have some Intermediate Experience with Chinese",
      },
      { id: "proficient", label: "I am Proficient with the Chinese Language" },
    ],
  },
  {
    title: "How much time do you want to learn Chinese",
    options: [
      {
        id: "5min",
        label: "5 Minutes / Day",
        icon: <Clock className="h-5 w-5" />,
      },
      {
        id: "10min",
        label: "10 Minutes / Day",
        icon: <Clock className="h-5 w-5" />,
      },
      {
        id: "15min",
        label: "15 Minutes / Day",
        icon: <Clock className="h-5 w-5" />,
      },
      {
        id: "20min",
        label: "20 Minutes / Day",
        icon: <Clock className="h-5 w-5" />,
      },
    ],
  },
];

export function LanguagePreferencesForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    motherLanguage: "",
    learningLanguage: "",
    proficiencyLevel: "",
    learningTime: "",
  });

  const handleOptionSelect = (optionId: string) => {
    const stepKey = Object.keys(selections)[currentStep];
    setSelections((prev) => ({
      ...prev,
      [stepKey]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-blue-500 rounded-lg p-4 flex items-center">
          <Button
            variant="ghost"
            className="text-white p-0 hover:bg-blue-600"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="flex-1 text-center text-sm font-medium">
            Completed {currentStep + 1}/4
          </span>
        </div>

        <h1 className="text-xl font-semibold text-center">
          {currentStepData.title}
        </h1>

        <div className="space-y-3">
          {currentStepData.options.map((option) => (
            <OptionButton
              key={option.id}
              option={option}
              isSelected={
                selections[Object.keys(selections)[currentStep]] === option.id
              }
              onOptionSelect={handleOptionSelect}
            />
            // <button
            //   key={option.id}
            //   onClick={() => handleOptionSelect(option.id)}
            //   className={`w-full flex items-center p-4 rounded-lg transition-colors ${
            //     selections[Object.keys(selections)[currentStep]] === option.id
            //       ? "bg-blue-500"
            //       : "bg-gray-900 hover:bg-gray-800"
            //   }`}
            // >
            //   {option.flag && (
            //     <span className="text-2xl mr-3">{option.flag}</span>
            //   )}
            //   {option.icon && <span className="mr-3">{option.icon}</span>}
            //   <span className="text-sm font-medium">{option.label}</span>
            // </button>
          ))}
        </div>

        <Button
          variant="custom-accented"
          className="w-full h-12"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

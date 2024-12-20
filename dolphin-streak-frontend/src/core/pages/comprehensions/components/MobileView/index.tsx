import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export function ComprehensionsMobileView() {
  return (
    <div className="min-h-screen bg-[#080e1e]">
      {/* Header */}
      <div className="flex items-center bg-[#0a84ff] text-white p-4">
        <ChevronLeft className="h-6 w-6" />
        <h3 className="flex-grow text-center text-xl font-semibold">Course</h3>
      </div>

      {/* Content */}
      <div className="p-5 text-white">
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="flex flex-col items-center justify-center space-y-2 pt-6">
            {[
              "Are you sure",
              "you want",
              "to take the",
              "Comprehension",
              "Assignment?"
            ].map((text, index) => (
              <div
                key={index}
                className="text-4xl md:text-6xl font-fredoka text-center text-white"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                {text}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Fixed Button Container */}
      <div className="fixed bottom-5 left-0 right-0 px-6">
        <Button 
          className="w-full bg-[#5B7BFE] hover:bg-[#4a6afe] text-white py-6"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
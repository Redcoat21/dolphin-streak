import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function CoursePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            className="text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-xl font-semibold">Course</h3>
        </div>

        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-bold">Today is Day 30</h2>
          <p className="text-2xl">Do you want to</p>
          <p className="text-2xl">continue?</p>

          <Button
            variant="custom-blue"
            className="w-full py-6 text-lg"
            onClick={() => router.push("/course/lesson")}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

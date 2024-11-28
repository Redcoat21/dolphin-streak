import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { RichTextEditor } from "@/core/components/shared/editor";

export const NewThreadPage = () => {
    const router = useRouter();

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleCreateThread = useCallback(() => {
        // Handle thread creation logic here
        console.log("Create new thread");
    }, []);


  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-blue-500 rounded-lg p-4 mb-6 flex items-center">
          <Button
            variant="ghost"
            className="text-white p-0 hover:bg-transparent"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="flex-1 text-center font-semibold">Forum</span>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
            <input type="text" placeholder="Title" className="w-full bg-gray-700 rounded-lg p-2 mb-4" />
            <RichTextEditor />
        </div>
        <Button onClick={handleCreateThread} className="w-full bg-blue-500 rounded-lg p-2 mt-4">Create New Thread</Button>
      </div>
    </div>
  );
};

export default NewThreadPage;

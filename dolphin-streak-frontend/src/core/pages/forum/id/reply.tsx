import { ArrowLeft } from "lucide-react";
import { Button } from "src/components/ui/button";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { CustomRichTextEditor } from "@/core/components/shared/editor";

export function ReplyPage() {
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Underline,
      TextAlign,
      Superscript,
      SubScript,
    ],
    content: "<p>Start typing your reply...</p>",
  });

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleReply = useCallback(() => {
    // Handle reply logic here
    console.log("Reply to thread");
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
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <img
                src="/api/placeholder/40/40"
                alt="Avatar"
                className="rounded-full mr-2"
              />
              <span>Person</span>
            </div>
            <h3 className="text-lg font-semibold">Forum Title</h3>
            <p>
              Lorem ipsum odor amet, consectetuer adipiscing elit. Lobortis
              convallis accumsan condimentum pellentesque odio maecenas nullam
              molestie varius facilisis elementum.
            </p>
            <span className="text-sm text-gray-400">Sunday, 20-10-2024</span>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <img
                src="/api/placeholder/40/40"
                alt="Avatar"
                className="rounded-full mr-2"
              />
              <span>Person</span>
            </div>
            <p>
              Lorem ipsum odor amet, consectetuer adipiscing elit. Lobortis
              convallis accumsan condimentum pellentesque odio maecenas nullam
              molestie varius facilisis elementum.
            </p>
            <span className="text-sm text-gray-400">Sunday, 20-10-2024</span>
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg mt-4">
          <CustomRichTextEditor editor={editor} />
        </div>
        <Button
          onClick={handleReply}
          className="w-full bg-blue-500 rounded-lg p-2 mt-4"
        >
          Reply To Thread
        </Button>
      </div>
    </div>
  );
}

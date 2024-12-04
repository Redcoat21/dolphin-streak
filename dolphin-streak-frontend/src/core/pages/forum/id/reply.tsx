import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Node } from "@tiptap/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ReplyPage() {
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Superscript,
      SubScript,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] w-full rounded-lg bg-secondary p-4 text-foreground outline-none",
      },
    },
  });

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubmit = useCallback(() => {
    // Handle form submission
    console.log("Form submitted");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-4 py-3 flex items-center gap-4">
        <button
          onClick={handleBack}
          className="text-primary-foreground hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-primary-foreground text-lg font-medium">Forum</h1>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-4">
          <Input
            placeholder="Title"
            className="bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
          />

          {editor && (
            <div className="rounded-lg bg-secondary overflow-hidden">
              <div className="border-b border-muted p-2 flex gap-1 overflow-x-auto">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-muted transition-colors ${
                    editor.isActive("bold") ? "bg-muted" : ""
                  }`}
                >
                  B
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-muted transition-colors ${
                    editor.isActive("italic") ? "bg-muted" : ""
                  }`}
                >
                  I
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`p-2 rounded hover:bg-muted transition-colors ${
                    editor.isActive("underline") ? "bg-muted" : ""
                  }`}
                >
                  U
                </button>
                {/* Add more formatting buttons as needed */}
              </div>
              {/* {editor.view.dom} */}
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Create New Thread
        </Button>
      </div>
    </div>
  );
}

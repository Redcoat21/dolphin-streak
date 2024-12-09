"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/core/components/shared/RichTextEditor";

export default function ReplyPage() {
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
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
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-4",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-4",
        },
      }),
      ListItem,
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
    <div className="min-h-screen bg-[#0B1120]">
      {/* Header */}
      <div className="bg-[#0066FF] px-4 py-3 flex items-center gap-4">
        <button
          onClick={handleBack}
          className="text-white hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-white text-lg font-medium">Forum</h1>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-4">
          <Input
            placeholder="Title"
            className="bg-[#1E293B] border-0 text-white placeholder:text-gray-400 h-12"
          />

          {editor && <RichTextEditor editor={editor} />}
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-[#0066FF] text-white hover:bg-[#0052CC] h-12 rounded-lg font-medium"
        >
          Create New Thread
        </Button>
      </div>
    </div>
  );
}

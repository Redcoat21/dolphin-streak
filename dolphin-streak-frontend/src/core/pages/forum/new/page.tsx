"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useEditor } from "@tiptap/react";
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
import RichTextEditor from "@/core/components/shared/RichTextEditor";
import { trpc } from "@/utils/trpc";
import { useAuthStore } from "@/core/stores/authStore";
import { Input } from "@/components/ui/input";

export default function NewPostPage() {
  const router = useRouter();
  const { getAccessToken, getEmail } = useAuthStore();
  const accessToken = getAccessToken();
  const [title, setTitle] = useState("");

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
          "min-h-[150px] w-full rounded-lg bg-[#1E293B] p-4 text-white outline-none placeholder:text-gray-400",
      },
    },
  });

  const { mutate: createThread } = trpc.forum.createThread.useMutation({
    onSuccess: () => {
      router.push('/forum');
    },
    onError: (error) => {
      console.error('Failed to create thread:', error);
      // TODO: Add error toast notification
    },
  });

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

const handleSubmit = useCallback(() => {
  if (!editor?.getHTML() || !title.trim()) {
    return;
  }

  const userEmail = getEmail(); // Get the user's email

  createThread({
    title: title.trim(),
    content: editor.getHTML(),
    accessToken: accessToken || "",
    email: userEmail || "", // Add this line
  });
}, [editor, title, createThread, accessToken, useAuthStore]);

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
        <h1 className="text-white text-lg font-medium">New Post</h1>
      </div>

      {/* Editor */}
      <div className="p-4 space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-[#1E293B] border-none text-white placeholder:text-gray-400"
        />

        {editor && <RichTextEditor editor={editor} />}

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-[#4F46E5] text-white py-3 rounded-lg hover:bg-[#4338CA] transition-colors"
        >
          Create New Post
        </button>
      </div>
    </div>
  );
}

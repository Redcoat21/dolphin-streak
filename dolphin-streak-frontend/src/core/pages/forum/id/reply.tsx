"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
import { ForumReplies } from "./components/ForumReplies";

export default function ReplyPage() {
  const router = useRouter();
  const params = useParams();
  const { getAccessToken, getEmail } = useAuthStore();
  const accessToken = getAccessToken();
  const forumId = params?.id as string;
  const userEmail = getEmail();

  // Get forum details
  const { data: forumDetail, refetch: refetchForum } = trpc.forum.getForumDetail.useQuery({
    forumId,
    accessToken: accessToken || "",
  }, {
    enabled: !!forumId && !!accessToken,

  });

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



  const { mutate: createReply } = trpc.forum.createReply.useMutation({
    onSuccess: () => {
      refetchForum();
      editor?.commands.clearContent();
    },
    onError: (error) => {
      console.error('Failed to create reply:', error);
      // TODO: Add error toast notification
    },
  });

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubmit = useCallback(() => {
    if (!editor?.getHTML()) {
      return;
    }

    createReply({
      forumId,
      title: forumDetail?.data?.title || "",
      content: editor.getHTML(),
      accessToken: accessToken || "",
      email: userEmail || "",
    });
  }, [editor, forumId, forumDetail?.data?.title, createReply, accessToken]);

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

      {/* Original Post */}
      {forumDetail?.data && (
        <div className="p-4 bg-[#1E293B] mt-4 mx-4 rounded-lg">
          <div className="flex items-start gap-3">
            <img
              src={forumDetail.data.user.avatarSrc || `https://api.dicebear.com/7.x/avataaars/svg?seed=${forumDetail.data.user.username}`}
              alt={forumDetail.data.user.username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-white font-semibold text-lg">{forumDetail.data.title}</h2>
              <p className="text-gray-300 mt-2">
                <div dangerouslySetInnerHTML={{ __html: forumDetail.data.content }} />
              </p>
            </div>
          </div>
          <ForumReplies replies={forumDetail.data.replies} />
        </div>
      )}

      {/* Editor */}
      <div className="p-4">
        {editor && <RichTextEditor editor={editor} />}

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-[#4F46E5] text-white py-3 rounded-lg hover:bg-[#4338CA] transition-colors"
        >
          Reply To Thread
        </button>
      </div>
    </div>
  );
}

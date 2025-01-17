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
import { Header } from "@/core/pages/dasboard/components/Header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FeedbackType } from "@/server/types/feedback";

export default function NewFeedbackPage() {
    const router = useRouter();
    const { getAccessToken } = useAuthStore();
    const accessToken = getAccessToken();
    const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.FEEDBACK);
    const { toast } = useToast();

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
                    "min-h-[250px] w-full rounded-lg bg-[#1E293B] p-4 text-white outline-none placeholder:text-gray-400",
            },
        },
    });

    const { mutate: createFeedback } = trpc.feedback.create.useMutation({
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Feedback submitted successfully!",
            });
            router.push('/feedback');
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to submit feedback",
                variant: "destructive"
            });
        },
    });

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleSubmit = useCallback(() => {
        if (!editor?.getHTML()) {
            toast({
                title: "Error",
                description: "Please enter your feedback",
                variant: "destructive"
            });
            return;
        }

        createFeedback({
            type: feedbackType.toString(),
            content: editor.getHTML(),
            accessToken: accessToken || "",
        });
    }, [editor, feedbackType, createFeedback, accessToken]);

    return (
        <div className="min-h-screen bg-[#0B1120]">
            <Header />

            <div className="pt-24 px-4 max-w-4xl mx-auto">
                <div className="bg-[#1E293B] rounded-lg shadow-xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={handleBack}
                            className="text-white hover:opacity-80 transition-opacity"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <h1 className="text-white text-2xl font-semibold">Submit Feedback</h1>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Feedback Type
                            </label>
                            <Select
                                value={feedbackType}
                                onValueChange={(value) => setFeedbackType(value as FeedbackType)}
                            >
                                <SelectTrigger className="w-full bg-[#2D3748] border-none text-white">
                                    <SelectValue placeholder="Select feedback type" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectItem value={FeedbackType.FEEDBACK}>Feedback</SelectItem>
                                    <SelectItem value={FeedbackType.REPORT}>Report</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Your Feedback
                            </label>
                            {editor && <RichTextEditor editor={editor} />}
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-[#4F46E5] text-white py-3 rounded-lg hover:bg-[#4338CA] transition-colors font-medium"
                        >
                            Submit Feedback
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

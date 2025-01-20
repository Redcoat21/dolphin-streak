import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/utils/generic";

interface ForumReply {
    _id: string;
    user: {
        _id: string;
        email: string;
    };
    content: string;
    createdAt: string;
    __v: number;
}

interface ForumRepliesProps {
    replies: ForumReply[];
}

export function ForumReplies({ replies }: ForumRepliesProps) {
    return (
        <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Replies</h3>
            {replies.map((reply) => (
                <div key={reply._id} className="bg-[#1E293B] p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user.email}`}
                                alt={reply.user.email}
                                className="rounded-full object-cover"
                            />
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="text-white font-medium">{reply.user.email}</p>
                                <span className="text-gray-400 text-sm">
                                    {formatDate(reply.createdAt)}
                                </span>
                            </div>
                            <div
                                className="text-gray-300 mt-2"
                                dangerouslySetInnerHTML={{ __html: reply.content }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/utils/generic";

interface ForumPostProps {
  title: string;
  content: string;
  author: string;
  date: string;
  avatarSrc?: string;
  onClick?: () => void;
}

export function ForumPost({
  title,
  content,
  author,
  date,
  avatarSrc,
  onClick
}: ForumPostProps) {
  return (
    <Card
      onClick={onClick}
      className="bg-[#1E1F23] border-none hover:bg-[#2E2F33] transition-all duration-200 cursor-pointer rounded-xl overflow-hidden"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 rounded-full border-2 border-[#4F46E5]">
            <img
              src={avatarSrc || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`}
              alt={author}
              className="rounded-full object-cover"
            />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-white font-semibold text-xl truncate">{title}</h3>
              <span className="text-sm text-gray-400 whitespace-nowrap">@{author}</span>
            </div>
            <p className="text-gray-300 mt-2 line-clamp-3">{content}</p>
            <div className="mt-3 text-right">
              <span className="text-sm text-gray-500">{formatDate(date)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
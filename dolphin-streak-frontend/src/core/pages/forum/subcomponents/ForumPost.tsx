import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ForumPostProps {
  title: string;
  content: string;
  author: string;
  date: string;
  avatarSrc?: string;
}

export function ForumPost({
  title,
  content,
  author,
  date,
  avatarSrc,
}: ForumPostProps) {
  return (
    <Card className="bg-[#1a1b1e] border-none hover:bg-[#1e1f23] transition-colors duration-200 cursor-pointer">
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 rounded-full bg-blue-600 border-2 border-blue-400">
            <img
              src={avatarSrc || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + author}
              alt={author}
              className="rounded-full"
            />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
              <span className="text-sm text-gray-400 whitespace-nowrap">-{author}</span>
            </div>
            <p className="text-gray-300 text-sm line-clamp-2 mt-1">{content}</p>
            <div className="text-right mt-2">
              <span className="text-xs text-gray-500">{date}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
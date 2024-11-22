import { Avatar } from "@/components/ui/avatar";

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
    <div className="bg-gray-900 rounded-lg p-4 space-y-2">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 rounded-full bg-blue-500">
          <img
            src={avatarSrc || "/api/placeholder/40/40"}
            alt={author}
            className="rounded-full"
          />
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-semibold">{title}</h3>
            <span className="text-sm text-gray-400">-{author}</span>
          </div>
          <p className="text-gray-300 text-sm">{content}</p>
          <div className="text-right mt-2">
            <span className="text-sm text-gray-400">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onNewPost: () => void;
}

export function SearchBar({ onSearch, onNewPost }: SearchBarProps) {
  return (
    <div className="flex gap-3 items-center mb-6">
      <div className="relative flex-1">
        <Input
          placeholder="Search Forum"
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-[#1E1F23] border-none text-white placeholder:text-gray-400 pl-4 pr-10 py-6 rounded-xl"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <button
        onClick={onNewPost}
        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white p-4 rounded-xl transition-colors flex items-center justify-center"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
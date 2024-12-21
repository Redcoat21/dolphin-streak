import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

// Search Bar Component
interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter();

  return (
    <div className="flex gap-2 items-center">
      <Input
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 bg-[#1E293B] border-none text-white placeholder:text-gray-400"
      />
      <button
        onClick={() => router.push('/forum/new')}
        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white p-2 rounded-lg transition-colors"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}

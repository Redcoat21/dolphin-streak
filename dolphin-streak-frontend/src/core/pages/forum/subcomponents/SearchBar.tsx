import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

// Search Bar Component
interface SearchBarProps {
  onSearch: (query: string) => void;
  onNewPost: () => void;
}

export function SearchBar({ onSearch, onNewPost }: SearchBarProps) {
  return (
    <div className="flex gap-3 mb-6">
      <div className="flex-1 relative">
        <Input
          placeholder="Search Forum"
          className="w-full bg-gray-900 border-gray-800 text-white pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      <Link href="/forum/new">
        <Button className="bg-blue-500 hover:bg-blue-600 h-10 w-10 p-0">
          <Plus className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}

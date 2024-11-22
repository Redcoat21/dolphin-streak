import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Search Bar Component
interface SearchBarProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onNewPost: () => void;
}

export function SearchBar({
  searchValue,
  onSearch,
  onNewPost,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(searchValue);

  useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onSearch]);

  return (
    <div className="flex gap-3 mb-6">
      <div className="flex-1 relative">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search Forum"
          className="w-full bg-gray-900 border-gray-800 text-white pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      <Button
        onClick={onNewPost}
        className="bg-blue-500 hover:bg-blue-600 h-10 w-10 p-0"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}

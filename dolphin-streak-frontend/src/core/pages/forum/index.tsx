import { ArrowLeft, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./subcomponents/SearchBar";
import { ForumPost } from "./subcomponents/ForumPost";
import { Pagination } from "./subcomponents/Pagination";

// Main Forum Page Component
export function ForumPage() {
  const forumPosts = [
    {
      title: "Forum Title",
      content:
        "Lorem ipsum odor amet, consectetuer adipiscing elit. Lobortis convallis accumsan condimentum pellentesque odio maecenas nullam molestie varius facilisis elementum",
      author: "Person",
      date: "Sunday, 20-10-2024",
      avatarSrc: "/api/placeholder/40/40",
    },
    // Add more posts as needed
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-blue-500 rounded-lg p-4 mb-6 flex items-center">
          <Button
            variant="ghost"
            className="text-white p-0 hover:bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="flex-1 text-center font-semibold">Forum</span>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={(query) => console.log(query)}
          onNewPost={() => console.log("New post")}
        />

        {/* Forum Posts */}
        <div className="space-y-4">
          {forumPosts.map((post, index) => (
            <ForumPost key={index} {...post} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={1}
          totalPages={99}
          onPageChange={(page) => console.log(`Page ${page}`)}
        />
      </div>
    </div>
  );
}

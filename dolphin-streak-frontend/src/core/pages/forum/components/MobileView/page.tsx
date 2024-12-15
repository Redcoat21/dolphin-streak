import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SearchBar } from "../../subcomponents/SearchBar";
import { ForumPost } from "../../subcomponents/ForumPost";
import { Pagination } from "../../subcomponents/Pagination";

interface IForumMobileViewProps {
    forumPosts: {
        id: number;
        title: string;
        content: string;
        author: string;
        date: string;
        avatarSrc?: string;
    }[];
    currentPage: number;
    totalPages: number;
    handleSearch: (query: string) => void;
    handleNewPost: () => void;
    handleReply: (postId: number) => void;
    handlePageChange: (page: number) => void;
}

export function ForumMobileView({
    forumPosts,
    currentPage,
    totalPages,
    handleSearch,
    handleNewPost,
    handleReply,
    handlePageChange
}: IForumMobileViewProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="bg-blue-600 p-4 sticky top-0 z-10 shadow-lg">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        className="text-white p-0 hover:bg-blue-700 rounded-lg"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <span className="flex-1 text-center text-lg font-semibold">Forum</span>
                    <div className="w-6" /> {/* Spacer for symmetry */}
                </div>
            </div>

            <div className="px-4 py-6">
                <SearchBar
                    onSearch={handleSearch}
                    onNewPost={handleNewPost}
                />

                <div className="space-y-4 mb-8">
                    {forumPosts.map((post) => (
                        <ForumPost
                            key={post.id}
                            {...post}
                            onClick={() => handleReply(post.id)}
                        />
                    ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
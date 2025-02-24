import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SearchBar } from "../../subcomponents/SearchBar";
import { ForumPost } from "../../subcomponents/ForumPost";
import { Pagination } from "../../subcomponents/Pagination";
import { TForum } from "@/server/types/forums";

interface IForumMobileViewProps {
    forumPosts: TForum[];
    currentPage: number;
    totalPages: number;
    handleSearch: (query: string) => void;
    handleNewPost: () => void;
    handleReply: (postId: string) => void;
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
        <div className="min-h-screen bg-[#0B1120] text-white">
            <div className="bg-gradient-to-r from-[#0A84FF] to-[#5AB9EA] p-4 sticky top-0 z-10 shadow-lg">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        className="text-white p-0"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <span className="flex-1 text-center text-lg font-semibold">Forum</span>
                    <div className="w-6" />
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
                            key={post._id}
                            title={post.title}
                            content={post.content}
                            date={post.createdAt}
                            author={post.user.username}
                            avatarSrc={post.user.avatarSrc}
                            onClick={() => handleReply(post._id)}
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
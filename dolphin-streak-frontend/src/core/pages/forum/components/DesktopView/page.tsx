import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { SearchBar } from "../../subcomponents/SearchBar";
import { ForumPost } from "../../subcomponents/ForumPost";
import { Pagination } from "../../subcomponents/Pagination";
import { Header } from "@/core/pages/dasboard/components/Header";
import { TForum } from "@/server/types/forums";

interface IForumDekstopViewProps {
    forumPosts: TForum[];
    currentPage: number;
    totalPages: number;
    handleSearch: (query: string) => void;
    handleNewPost: () => void;
    handleReply: (id: string) => void;
    handlePageChange: (page: number) => void;
}

export function ForumDesktopView({
    forumPosts,
    currentPage,
    totalPages,
    handleSearch,
    handleNewPost,
    handleReply,
    handlePageChange
}: IForumDekstopViewProps) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#0B1120] text-white">
            <Header currentPath={pathname} />
            <main className="px-8 py-12 mt-20 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl font-bold text-center text-white mb-8">
                        Forum Discussions
                    </h2>
                    <p className="text-gray-400 text-center max-w-2xl mx-auto">
                        Join the conversation, share your thoughts, and connect with fellow community members.
                    </p>
                </div>
                <div className="space-y-6">
                    <SearchBar
                        onSearch={handleSearch}
                        onNewPost={handleNewPost}
                    />
                    <div className="space-y-4">
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
            </main>
        </div>
    );
}
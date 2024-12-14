import { ArrowLeft, Search, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SearchBar } from "@/core/pages/forum/subcomponents/SearchBar";
import { ForumPost } from "@/core/pages/forum/subcomponents/ForumPost";
// import { Pagination } from "/core/pages/forum/subcomponents/Pagination";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Pagination } from "../../subcomponents/Pagination";

interface IForumMobileViewProps {

}


export function ForumMobileView({ }: IForumMobileViewProps) {
    const router = useRouter();
    const { page } = router.query;
    const currentPage = parseInt(page as string, 10) || 1;

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        console.log("Search query:", query);
    }, []);

    const handleNewPost = useCallback(() => {
        router.push("/forum/new");
    }, [router]);

    const forumPosts = [
        {
            id: 1,
            title: "Forum Title",
            content:
                "Lorem ipsum odor amet, consectetuer adipiscing elit. Lobortis convallis accumsan condimentum pellentesque odio maecenas nullam molestie varius facilisis elementum",
            author: "Person",
            date: "Sunday, 20-10-2024",
            avatarSrc: "/api/placeholder/40/40",
        },
    ];

    const handleReply = useCallback((id: number) => {
        router.push(`/forum/${id}/reply`);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-blue-500 rounded-lg p-4 mb-6 flex items-center">
                    <Button
                        variant="ghost"
                        className="text-white p-0 hover:bg-transparent"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <span className="flex-1 text-center font-semibold">Forum</span>
                </div>
                <SearchBar
                    searchValue={searchQuery}
                    onSearch={handleSearch}
                    onNewPost={handleNewPost}
                />
                <div className="space-y-4">
                    {forumPosts.map((post) => (
                        <ForumPost key={post.id} {...post} onReply={() => handleReply(post.id)} />
                    ))}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={99}
                    onPageChange={(page: number) => {
                        router.push(
                            {
                                pathname: router.pathname,
                                query: { ...router.query, page: page },
                            },
                            undefined,
                            { shallow: true }
                        );
                    }}
                />
            </div>
        </div>
    );
}

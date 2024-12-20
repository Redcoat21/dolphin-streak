import { useMediaQuery } from "@/hooks/use-media-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ForumMobileView } from "./components/MobileView/page";
import { ForumDesktopView } from "./components/DesktopView/page";

// const MOCK_FORUM_POSTS = [
//     {
//         id: 1,
//         title: "Forum Title",
//         content: "Lorem ipsum odor amet, consectetuer adipiscing elit. Lobortis convallis accumsan condimentum pellentesque odio maecenas nullam molestie varius facilisis elementum",
//         author: "Person",
//         date: "Sunday, 20-10-2024",
//         avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
//     },
//     {
//         id: 2,
//         title: "Another Forum Title",
//         content: "Lorem ipsum odor amet, consectetuer adipiscing elit. Lobortis convallis accumsan condimentum pellentesque odio maecenas nullam molestie varius facilisis elementum",
//         author: "Person2",
//         date: "Sunday, 20-10-2024",
//         avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
//     },
//     // Add more mock posts as needed
// ];

export function ForumPage() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const [searchQuery, setSearchQuery] = useState("");
    const [forumPosts, setForumPosts] = useState(MOCK_FORUM_POSTS);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        // Filter posts based on search query
        // const filteredPosts = MOCK_FORUM_POSTS.filter(
        //     post => post.title.toLowerCase().includes(query.toLowerCase()) ||
        //         post.content.toLowerCase().includes(query.toLowerCase())
        // );
        setForumPosts(filteredPosts);
    }, []);

    const handleNewPost = useCallback(() => {
        router.push("/forum/new");
    }, [router]);

    const handleReply = useCallback((id: number) => {
        router.push(`/forum/${id}/reply`);
    }, [router]);

    const handlePageChange = useCallback((page: number) => {
        router.push(`/forum?page=${page}`);
    }, [router]);

    const sharedProps = {
        forumPosts,
        currentPage,
        totalPages: 99,
        handleSearch,
        handleNewPost,
        handleReply,
        handlePageChange,
    };

    return isMobile ? (
        <ForumMobileView {...sharedProps} />
    ) : (
        <ForumDesktopView {...sharedProps} />
    );
}
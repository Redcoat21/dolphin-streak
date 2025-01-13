import { useMediaQuery } from "@/hooks/use-media-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { ForumMobileView } from "./components/MobileView/page";
import { ForumDesktopView } from "./components/DesktopView/page";
import { trpc } from "@/utils/trpc";
import { useAuthStore } from "@/core/stores/authStore";
import { TForum } from "@/server/types/forums";

export function ForumPage() {
    const { getAccessToken } = useAuthStore();
    const accessToken = getAccessToken();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const per_page = 10;

    const [searchQuery, setSearchQuery] = useState("");
    const [forumPosts, setForumPosts] = useState<TForum[]>([]);
    const { data: forumPostsData } = trpc.forum.getAllForums.useQuery({
        page: currentPage,
        per_page: 10,
        max_page: 1,
        search: searchQuery,
        accessToken: accessToken || "",
    });

    useEffect(() => {
        if (forumPostsData?.data) {
            setForumPosts(forumPostsData.data);
        }
    }, [forumPostsData]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handleNewPost = useCallback(() => {
        router.push("/forum/new");
    }, [router]);

    const handleReply = useCallback((id: string) => {
        router.push(`/forum/${id}/reply`);
    }, [router]);

    const handlePageChange = useCallback((page: number) => {
        router.push(`/forum?page=${page}`);
    }, [router]);

    const sharedProps = {
        forumPosts,
        currentPage,
        totalPages: Math.floor((forumPostsData?.data.length || 10) / per_page) || 1,
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
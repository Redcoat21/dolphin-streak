import { Container } from "@/core/components/container";
import { trpc } from "@/utils/trpc";
import { useAuthStore } from "@/core/stores/authStore";
import { useState, useTransition, useEffect } from "react";
import { FeedbackType, SortType } from "@/server/types/feedback";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Search,
    SortDesc,
    AlertCircle,
    Inbox,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/use-debounce";
import { AnimatePresence } from "framer-motion";
import { Header } from "../dasboard/components/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingFeedback } from "./components/loading-feedback";
import { FeedbackCard } from "./components/feedback-card";


interface FeedbackData {
    _id: string;
    content: string;
    type: FeedbackType;
    createdAt: string;
    user: {
        email: string;
    };
}


export function FeedbackPage() {
    const { getAccessToken } = useAuthStore();
    const accessToken = getAccessToken();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [sort, setSort] = useState<SortType>(SortType.NEWEST);
    const [type, setType] = useState<"0" | "1" | "any">("any");
    const [activeTab, setActiveTab] = useState<"all" | "reports" | "feedback">("all");
    const [isPending, startTransition] = useTransition();
    const [showError, setShowError] = useState(false);
    const { toast } = useToast();

    const {
        data: feedbackData,
        refetch,
        isLoading,
        isError,
    } = trpc.feedback.getAllFeedbackForUser.useQuery(
        {
            accessToken: accessToken || "",
            sort,
            search: debouncedSearch,
            type: type
        },
        {
            enabled: !!accessToken,
        }
    );

    useEffect(() => {
        switch (activeTab) {
            case "reports":
                setType("1");
                break;
            case "feedback":
                setType("0");
                break;
            default:
                setType("any");
                break;
        }
    }, [activeTab]);


    return (
        <Container className="bg-[#0B1120] min-h-screen">
            <Header currentPath="/feedback" />

            <div className="mx-auto max-w-7xl px-4 py-6 pt-24">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        Feedback Dashboard
                    </h1>
                    <p className="text-gray-400">
                        Monitor and manage your feedback and reports in real-time
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList className="bg-gray-800/50 border-gray-700">
                        <TabsTrigger value="all" className="text-gray-400 data-[state=active]:text-white">
                            All
                        </TabsTrigger>
                        <TabsTrigger value="reports" className="text-gray-400 data-[state=active]:text-white">
                            Reports
                        </TabsTrigger>
                        <TabsTrigger value="feedback" className="text-gray-400 data-[state=active]:text-white">
                            Feedback
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search feedback..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Select
                                value={sort}
                                onValueChange={(value: SortType) => setSort(value)}
                            >
                                <SelectTrigger className="w-[160px] bg-gray-800/50 border-gray-700 text-white">
                                    <SortDesc className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    <SelectItem value={SortType.NEWEST}>Newest first</SelectItem>
                                    <SelectItem value={SortType.OLDEST}>Oldest first</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading ? (
                        <LoadingFeedback />
                    ) : feedbackData?.data && feedbackData.data.length > 0 ? (
                        <AnimatePresence>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {feedbackData.data.map((feedback) => (
                                    <FeedbackCard key={feedback._id} feedback={feedback} />
                                ))}
                            </div>
                        </AnimatePresence>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Inbox className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-white">No feedback found</h3>
                            <p className="mt-1 text-gray-400">
                                {search
                                    ? "Try adjusting your search or filter criteria"
                                    : "When you receive feedback, it will appear here"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={showError} onOpenChange={setShowError}>
                <AlertDialogContent className="bg-gray-800 border-gray-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-white">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            Error Loading Feedback
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            There was a problem loading your feedback. Please try again later or contact support if the issue persists.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowError(false)}
                            className="border-gray-700 text-gray-300 hover:text-white"
                        >
                            Dismiss
                        </Button>
                        <Button onClick={() => refetch()}>
                            Try Again
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </Container>
    );
}
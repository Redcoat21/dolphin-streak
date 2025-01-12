import { Container } from "@/core/components/container";
import { trpc } from "@/utils/trpc";
import { useAuthStore } from "@/core/stores/authStore";
import { useState, useTransition } from "react";
import { FeedbackType, SortType } from "@/server/types/feedback";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SortDesc, Filter, AlertCircle, Inbox } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Header } from "../dasboard/components/Header";
import useDebounce from "@/hooks/use-debounce";

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
            type,
        },
        {
            enabled: !!accessToken,
            onError: (error: any) => {
                setShowError(true);
                toast({
                    title: "Error loading feedback",
                    description: error.message,
                    variant: "destructive",
                });
            },
        }
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSortChange = (value: SortType) => {
        startTransition(() => {
            setSort(value);
        });
    };

    const handleTypeChange = (value: "0" | "1" | "any") => {
        startTransition(() => {
            setType(value);
        });
    };

    const getFeedbackTypeColor = (type: FeedbackType) => {
        return type === FeedbackType.REPORT
            ? "bg-red-100 text-red-800"
            : "bg-blue-100 text-blue-800";
    };

    return (
        <Container>
            <Header currentPath="/feedback" />

            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Feedback Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        View and manage all your feedback and reports in one place
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search feedback..."
                                value={search}
                                onChange={handleSearchChange}
                                className="pl-9"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Select onValueChange={handleSortChange} defaultValue={sort}>
                                <SelectTrigger className="w-[160px]">
                                    <SortDesc className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={SortType.NEWEST}>Newest first</SelectItem>
                                    <SelectItem value={SortType.OLDEST}>Oldest first</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={handleTypeChange} defaultValue={type}>
                                <SelectTrigger className="w-[160px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">All types</SelectItem>
                                    <SelectItem value="0">Reports only</SelectItem>
                                    <SelectItem value="1">Feedback only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="overflow-hidden">
                                    <CardHeader>
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-20" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : feedbackData?.data && feedbackData.data.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {feedbackData.data.map((feedback) => (
                                <Card
                                    key={feedback._id}
                                    className="transition-shadow hover:shadow-lg"
                                >
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg font-semibold truncate">
                                                {feedback.user.email}
                                            </CardTitle>
                                            <Badge
                                                variant="secondary"
                                                className={getFeedbackTypeColor(feedback.type)}
                                            >
                                                {feedback.type === FeedbackType.REPORT ? "Report" : "Feedback"}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            {format(new Date(feedback.createdAt), "PPpp")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700 whitespace-pre-wrap">
                                            {feedback.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Inbox className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No feedback found</h3>
                            <p className="mt-1 text-gray-500">
                                {search
                                    ? "Try adjusting your search or filter criteria"
                                    : "When you receive feedback, it will appear here"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={showError} onOpenChange={setShowError}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            Error Loading Feedback
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            There was a problem loading your feedback. Please try again later or contact support if the issue persists.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowError(false)}>
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
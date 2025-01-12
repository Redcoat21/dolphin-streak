import { trpc } from '@/utils/trpc';
import { useAuthStore } from '@/core/stores/authStore';
import { useState, useTransition } from 'react';
import { FeedbackType, SortType } from '@/server/types/feedback';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SortDesc, Filter, AlertCircle, Inbox, Flag, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/core/pages/dasboard/components/Header';
import useDebounce from '@/hooks/use-debounce';
import { Container } from '@/core/components/container';

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
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [sort, setSort] = useState<SortType>(SortType.NEWEST);
    const [type, setType] = useState<'0' | '1' | 'any'>('any');
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
            accessToken: accessToken || '',
            sort,
            search: debouncedSearch,
            type,
        },
        {
            enabled: !!accessToken,
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

    const handleTypeChange = (value: '0' | '1' | 'any') => {
        startTransition(() => {
            setType(value);
        });
    };

    const getFeedbackTypeColor = (type: FeedbackType) => {
        return type === FeedbackType.REPORT
            ? 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-50'
            : 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-50';
    };

    const getFeedbackTypeIcon = (type: FeedbackType) => {
        return type === FeedbackType.REPORT ? <Flag className="mr-1 h-4 w-4" /> : <MessageSquare className="mr-1 h-4 w-4" />;
    };

    const clearFilters = () => {
        startTransition(() => {
            setSearch('');
            setSort(SortType.NEWEST);
            setType('any');
        });
    };

    const hasActiveFilters = search !== '' || sort !== SortType.NEWEST || type !== 'any';

    return (
        <div>
            <Container className="py-12">
                <Header currentPath="/feedback" />
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                        User Feedback & Reports
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Stay informed with valuable insights from your users. Manage feedback and reports efficiently.
                    </p>
                </div>

                <div className="grid gap-4 md:gap-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search feedback or keywords..."
                                value={search}
                                onChange={handleSearchChange}
                                className="pl-10 shadow-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Select onValueChange={handleSortChange} defaultValue={sort}>
                                <SelectTrigger className="w-[150px] sm:w-[180px] shadow-sm">
                                    <SortDesc className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={SortType.NEWEST}>Newest First</SelectItem>
                                    <SelectItem value={SortType.OLDEST}>Oldest First</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={handleTypeChange} defaultValue={type}>
                                <SelectTrigger className="w-[150px] sm:w-[180px] shadow-sm">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">All</SelectItem>
                                    <SelectItem value="0">Reports</SelectItem>
                                    <SelectItem value="1">Feedback</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            {search && (
                                <Badge variant="secondary">
                                    Search: {search}
                                    <button onClick={() => setSearch('')} className="ml-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                    </button>
                                </Badge>
                            )}
                            {sort !== SortType.NEWEST && (
                                <Badge variant="secondary">
                                    Sorted by: {sort === SortType.OLDEST ? 'Oldest' : 'Newest'}
                                    <button onClick={() => setSort(SortType.NEWEST)} className="ml-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                    </button>
                                </Badge>
                            )}
                            {type !== 'any' && (
                                <Badge variant="secondary">
                                    Type: {type === '0' ? 'Reports' : 'Feedback'}
                                    <button onClick={() => setType('any')} className="ml-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                    </button>
                                </Badge>
                            )}
                            <Button variant="outline" size="sm" onClick={clearFilters} className="ml-auto">
                                Clear Filters
                            </Button>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <Skeleton className="h-5 w-1/2" />
                                        <Skeleton className="h-4 w-2/3 mt-1" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6 mt-2" />
                                        <Skeleton className="h-4 w-3/4 mt-2" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : feedbackData?.data && feedbackData.data.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {feedbackData.data.map((feedback) => (
                                <Card key={feedback._id} className="shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex items-center font-medium">
                                            {getFeedbackTypeIcon(feedback.type)}
                                            {feedback.user.email}
                                            <Badge
                                                variant="secondary"
                                                className={`${getFeedbackTypeColor(feedback.type)} ml-auto`}
                                            >
                                                {feedback.type === FeedbackType.REPORT ? 'Report' : 'Feedback'}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground">
                                            {format(new Date(feedback.createdAt), 'MMM d, yyyy h:mm a')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-sm text-gray-800 dark:text-gray-100 break-words">
                                            {feedback.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Inbox className="h-14 w-14 text-gray-400 dark:text-gray-500 mb-6" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                No feedback available
                            </h3>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                {search
                                    ? 'No feedback matches your search criteria. Please try adjusting your search.'
                                    : 'Feedback and reports from your users will appear here.'}
                            </p>
                        </div>
                    )}
                </div>
            </Container>

            <AlertDialog open={showError} onOpenChange={setShowError}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            Error Loading Feedback
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            There was an issue loading the feedback data. Please try again or contact support if the problem persists.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowError(false)}>
                            Dismiss
                        </Button>
                        <Button onClick={() => refetch()}>Try Again</Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
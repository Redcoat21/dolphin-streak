import { Container } from '@/core/components/container';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertCircle, ArrowLeft, CheckCircle, Inbox, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import { useAuthStore } from '@/core/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { LoadingFeedback } from './components/loading-feedback';
import { FeedbackType } from '@/server/types/feedback';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Header } from '../dasboard/components/Header';

export default function FeedbackIdPage() {
    const router = useRouter();
    const { toast } = useToast();
    const params = useParams();
    const feedbackId = params?.feedbackId as string;
    const [showError, setShowError] = useState(false);
    const { getAccessToken } = useAuthStore();
    const accessToken = getAccessToken();
    const { data: feedbackData, isLoading, isError, refetch } = trpc.feedback.getFeedbackById.useQuery(
        {
            accessToken: accessToken || "",
            feedbackId: feedbackId as string,
        },
        {
            enabled: !!accessToken,
        }
    );
    const feedback = feedbackData?.data;

    useEffect(() => {
        if (isError) {
            setShowError(true);
        }
    }, [isError]);

    const getFeedbackTypeInfo = (type: number) => {
        switch (type) {
            case 1:
                return {
                    label: 'Bug Report',
                    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
                    color: 'bg-red-100 text-red-800'
                };
            case 2:
                return {
                    label: 'Feature Request',
                    icon: <Volume2 className="h-5 w-5 text-blue-500" />,
                    color: 'bg-blue-100 text-blue-800'
                };
            default:
                return {
                    label: 'General Feedback',
                    icon: <Inbox className="h-5 w-5 text-gray-500" />,
                    color: 'bg-gray-100 text-gray-800'
                };
        }
    };

    if (isLoading) {
        return <LoadingFeedback />;
    }

    return (
        <div className="min-h-screen">
            <Header />
            <Container>
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Feedback List
                    </Button>

                    {/* Main Content */}
                    <Card className="shadow-lg m-48">
                        <CardHeader className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {feedback && getFeedbackTypeInfo(feedback.type).icon}
                                    <CardTitle className="text-2xl font-bold">
                                        Feedback Details
                                    </CardTitle>
                                </div>
                                {feedback && (
                                    <Badge className={`${getFeedbackTypeInfo(feedback.type).color} px-3 py-1`}>
                                        {getFeedbackTypeInfo(feedback.type).label}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-gray-500">
                                <p>Submitted by: {feedback?.user.email}</p>
                                <p>Date: {feedback && format(new Date(feedback.createdAt), 'PPP')}</p>
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            <ScrollArea className="h-[200px] rounded-md border p-4">
                                <p className="text-gray-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: feedback?.content || '' }} />
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </Container>

            {/* Error Dialog */}
            <AlertDialog open={showError} onOpenChange={setShowError}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            Error Loading Feedback
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            There was an error loading the feedback details. Please try again later or contact support if the problem persists.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button onClick={() => router.push('/feedback')}>
                            Return to Feedback List
                        </Button>
                        <Button variant="outline" onClick={() => refetch()}>
                            Try Again
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
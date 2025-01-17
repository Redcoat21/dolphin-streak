import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    MessageCircle,
    AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { FeedbackType } from "@/server/types/feedback";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

interface FeedbackData {
    _id: string;
    content: string;
    type: FeedbackType;
    createdAt: string;
    user: {
        email: string;
    };
}

export const FeedbackCard: React.FC<{ feedback: FeedbackData }> = ({ feedback }) => {
    const isReport = feedback.type === FeedbackType.REPORT;


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
        >
            <Link href={`/feedback/${feedback._id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-sm border-none cursor-pointer">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="rounded-full bg-gray-700 p-2">
                                    {isReport ? (
                                        <AlertTriangle className="h-4 w-4 text-red-400" />
                                    ) : (
                                        <MessageCircle className="h-4 w-4 text-blue-400" />
                                    )}
                                </div>
                                <div>
                                    <CardTitle className="text-base font-medium text-white">
                                        {feedback.user.email}
                                    </CardTitle>
                                    <CardDescription className="text-gray-400 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {format(new Date(feedback.createdAt), "PPpp")}
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className={`${isReport
                                    ? "bg-red-900/30 text-red-400 border-red-800"
                                    : "bg-blue-900/30 text-blue-400 border-blue-800"
                                    } border`}
                            >
                                {isReport ? "Report" : "Feedback"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-24">
                            <div className="text-gray-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: feedback.content }} />
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                        >
                            Mark as Read
                        </Button>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div >
    );
};
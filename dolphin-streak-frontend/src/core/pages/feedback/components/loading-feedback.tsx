import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingFeedback = () => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-sm border-none">
                    <CardHeader>
                        <Skeleton className="h-4 w-32 bg-gray-700" />
                        <Skeleton className="h-3 w-48 bg-gray-700" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-20 bg-gray-700" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
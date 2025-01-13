import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Mail, AlertTriangle, MessageCircle } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description }) => (
    <Card className="bg-white/5 backdrop-blur-sm border-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
        </CardContent>
    </Card>
);

interface StatsGridProps {
    stats: {
        total: number;
        reports: number;
        feedback: number;
    };
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
                title="Total Feedback"
                value={stats.total}
                icon={<Mail className="h-4 w-4 text-purple-400" />}
                description="Total feedback"
            />
            <StatsCard
                title="Reports"
                value={stats.reports}
                icon={<AlertTriangle className="h-4 w-4 text-red-400" />}
                description="Issues reported by users"
            />
            <StatsCard
                title="Feedback"
                value={stats.feedback}
                icon={<MessageCircle className="h-4 w-4 text-blue-400" />}
                description="General feedback"
            />
        </div>
    );
};
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface NotificationProps {
    notifications: {
        id: number;
        message: string;
        read: boolean;
    }[];
}

export function Notification({ notifications }: NotificationProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="text-white hover:bg-blue-600 relative"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {notifications.filter(n => !n.read).length}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 bg-gray-800 text-white border-none shadow-lg">
                <div className="space-y-2">
                    {notifications.map(notification => (
                        <div key={notification.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                            <p className={cn(notification.read ? "text-gray-400" : "font-semibold", "text-sm")}>{notification.message}</p>
                            {!notification.read && (
                                <Badge variant="secondary">New</Badge>
                            )}
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

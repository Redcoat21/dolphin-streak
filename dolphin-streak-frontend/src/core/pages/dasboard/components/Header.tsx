import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/core/stores/authStore";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Notification } from "@/core/components/shared/notification";

interface HeaderProps {
    currentPath?: string;
}

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        message: "New message from John Doe",
        read: false,
    },
    {
        id: 2,
        message: "Your course has been updated",
        read: true,
    },
    {
        id: 3,
        message: "New feedback on your assignment",
        read: false,
    }
]

export function Header({ currentPath }: HeaderProps) {
    const { logout } = useAuthStore();
    const router = useRouter();
    const pathToHome = [
        "/forum",
        "/challenges",
    ]
    return (
        <header className="fixed top-0 w-full bg-gradient-to-r from-[#0A84FF] to-[#5AB9EA] p-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                        <AvatarImage src="/temps/User/imgSource/User.png" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold text-white">Hello, User</h3>
                </div>
                <div className="flex items-center gap-4">
                    <Notification notifications={MOCK_NOTIFICATIONS} />
                    {currentPath !== '/forum' && (
                        <Button
                            variant="custom-blue"
                            className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
                            onClick={() => router.push('/forum')}
                        >
                            Forum
                        </Button>
                    )}
                    {(currentPath == '/forum' || currentPath) && (
                        <Button
                            variant="custom-blue"
                            className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
                            onClick={() => router.push('/')}
                        >
                            Home
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}

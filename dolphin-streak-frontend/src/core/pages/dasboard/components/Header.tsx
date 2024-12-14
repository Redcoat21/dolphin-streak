import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/core/stores/authStore";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

export function Header() {
    const { logout } = useAuthStore();
    const router = useRouter();

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
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-blue-600 relative"
                        onClick={() => router.push('/notifications')}
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                            {/* Notification Count */}
                        </span>
                    </Button>
                    <Button
                        variant="custom-blue"
                        className="bg-[#1B2335] hover:bg-[#5AB9EA] text-white rounded-md px-4 py-2"
                        onClick={() => router.push('/forum')}
                    >
                        Forum
                    </Button>
                </div>
            </div>
        </header>
    );
}

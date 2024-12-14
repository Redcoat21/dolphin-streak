import { Button } from "@/components/ui/button";
import { Container } from "@/core/components/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/core/stores/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Dashboard() {
    const { logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <Container>
            <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
                <div className="flex items-center">
                    <Avatar className="mr-2">
                        <AvatarImage src="/temps/User/imgSource/User.png" alt="User Icon" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">Hello, User</h3>
                </div>
                <Button variant="custom-blue" onClick={() => router.push('/forum')}>Forum</Button>
            </div>
            <div className="text-center my-8">
                <h2 className="text-3xl font-bold mb-6">Choose Your Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
                    <Link href="/daily-challenge" className="bg-gray-800 rounded-lg p-6 text-center hover:bg-blue-500 transition-transform transform hover:translate-y-[-5px]">
                        <h3 className="text-xl font-semibold mb-4">Daily Challenge</h3>
                        <img src="/temps/User/imgSource/daily.png" alt="Daily Challenge" className="w-16 mx-auto mb-4" />
                        <p className="text-gray-300">Put your knowledge to the test with our Daily Practice!</p>
                    </Link>
                    <Link href="/course" className="bg-gray-800 rounded-lg p-6 text-center hover:bg-blue-500 transition-transform transform hover:translate-y-[-5px]">
                        <h3 className="text-xl font-semibold mb-4">Course</h3>
                        <img src="/temps/User/imgSource/course.png" alt="Course" className="w-16 mx-auto mb-4" />
                        <p className="text-gray-300">Expand your knowledge with our interactive lessons!</p>
                    </Link>
                    <Link href="/comprehension" className="bg-gray-800 rounded-lg p-6 text-center hover:bg-blue-500 transition-transform transform hover:translate-y-[-5px]">
                        <h3 className="text-xl font-semibold mb-4">Comprehension</h3>
                        <img src="/temps/User/imgSource/comprehension.png" alt="Comprehension" className="w-16 mx-auto mb-4" />
                        <p className="text-gray-300">Show off your skills with a comprehension test!</p>
                    </Link>
                </div>
            </div>
            <div className="flex justify-center mt-8">
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
        </Container>
    );
}

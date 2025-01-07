import { Container } from "@/core/components/container";
import { useAuthStore } from "@/core/stores/authStore";
import { Header } from "../dasboard/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";

export function ProfilePage() {
    const { getAccessToken, logout } = useAuthStore();
    const accessToken = getAccessToken();
    const { data: user } = trpc.auth.getProfile.useQuery({ accessToken: accessToken || '' });
    return (
        <Container>
            <Header currentPath="/profile" />
            {/* <main className="px-4 py-10 mt-6 min-h-screen bg-[#0b1120] pt-20">
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-white/10 backdrop-blur-sm border-none">
                        <CardHeader className="flex flex-col items-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src="/temps/User/imgSource/User.png" alt="User" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl font-bold text-white">User Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-white">Username</Label>
                                    <Input id="username" defaultValue={user?.username || ''} className="bg-white/20 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white">Email</Label>
                                    <Input id="email" type="email" defaultValue={user?.email || ''} className="bg-white/20 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language" className="text-white">Preferred Language</Label>
                                    <Input id="language" defaultValue="English" className="bg-white/20 text-white" />
                                </div>
                                <div className="flex justify-between">
                                    <Button type="submit" className="bg-[#5AB9EA] hover:bg-[#5AB9EA]/80 text-white">
                                        Save Changes
                                    </Button>
                                    <Button type="button" variant="destructive" onClick={logout}>
                                        Logout
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main> */}
        </Container>
    );
}


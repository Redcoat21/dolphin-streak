import { Button } from '@/components/ui/button';
import { Container } from '@/core/components/container';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ShieldCheck } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAuthStore } from '@/core/stores/authStore';
import { useRouter } from 'next/navigation';

export function PricingPage() {
    const { getAccessToken } = useAuthStore();
    const router = useRouter();

    const handleFreeButtonClick = () => {
        if (getAccessToken()) {
            router.push('/dashboard');
        } else {
            router.push('/auth/register');
        }
    };

    const handlePremiumButtonClick = () => {
        if (getAccessToken()) {
            router.push('/profile');
        } else {
            router.push('/auth/register');
        }
    };


    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pb-5">
            <Container>
                <div className="mx-auto max-w-4xl pt-8">
                    <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Pricing Tier: Free */}
                        <Card className="bg-[#1E1E1E] shadow-xl border border-gray-700 transition duration-300 ease-in-out hover:shadow-2xl hover:border-purple-500">
                            <CardContent className="p-8 space-y-6">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-2 text-purple-500">Free</h2>
                                    <p className="text-gray-400 mb-4">Basic access to the platform.</p>
                                </div>
                                <ul className="list-none space-y-3 mb-6">
                                    <li className="flex items-center gap-2 text-gray-300"><CheckCircle className="w-4 h-4 text-green-500" /> Access to Forum</li>
                                    <li className="flex items-center gap-2 text-gray-300"><CheckCircle className="w-4 h-4 text-green-500" /> Limited Lives</li>
                                </ul>
                                <Button variant="outline" className="w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-200" onClick={handleFreeButtonClick}>Get Started</Button>
                            </CardContent>
                        </Card>

                        {/* Pricing Tier: Premium */}
                        <Card className="bg-[#1E1E1E] shadow-xl border border-gray-700 transition duration-300 ease-in-out hover:shadow-2xl hover:border-blue-500">
                            <CardContent className="p-8 space-y-6">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-2 text-blue-500">Premium</h2>
                                    <p className="text-gray-400 mb-4">Full access to all features, plus unlimited lives.</p>
                                </div>
                                <ul className="list-none space-y-3 mb-6">
                                    <li className="flex items-center gap-2 text-gray-300"><ShieldCheck className="w-4 h-4 text-green-500" /> Unlimited Lives</li>
                                    <li className="flex items-center gap-2 text-gray-300"><CheckCircle className="w-4 h-4 text-green-500" /> Access to Forum</li>
                                </ul>
                                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-colors duration-200" onClick={handlePremiumButtonClick}>Subscribe Now</Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-3xl font-semibold mb-4">Subscription Details</h2>
                        <p className="text-gray-400">Choose your subscription period and payment method.</p>
                    </div>

                    <div className="mt-8">
                        <Table className="border border-gray-700">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="py-4 px-6 text-left text-slate-200">Feature</TableHead>
                                    <TableHead className="py-4 px-6 text-center text-slate-200">Free</TableHead>
                                    <TableHead className="py-4 px-6 text-center text-slate-200">Premium</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="py-4 px-6">Lives</TableCell>
                                    <TableCell className="py-4 px-6 text-center"> </TableCell>
                                    <TableCell className="py-4 px-6 text-center"><ShieldCheck className="w-4 h-4 text-green-500" /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="py-4 px-6">Access to Forum</TableCell>
                                    <TableCell className="py-4 px-6 text-center"><CheckCircle className="w-4 h-4 text-green-500" /></TableCell>
                                    <TableCell className="py-4 px-6 text-center"><CheckCircle className="w-4 h-4 text-green-500" /></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Container>
        </div>
    );
}
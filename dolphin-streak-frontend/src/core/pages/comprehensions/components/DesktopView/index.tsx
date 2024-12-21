import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import router from "next/router";

export function ComprehensionsDesktopView() {
    return (
        <div className="min-h-screen bg-[#080e1e] flex">
            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <div className="flex items-center bg-[#0a84ff] text-white p-4">
                    <ChevronLeft className="h-6 w-6" onClick={() => router.push("/")}/>
                    <h3 className="flex-grow text-center text-xl font-semibold">Course</h3>
                </div>

                {/* Content */}
                <div className="p-10 text-white">
                    <Card className="bg-transparent border-none shadow-none max-w-4xl mx-auto">
                        <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
                            {[
                                "Are you sure",
                                "you want",
                                "to take the",
                                "Comprehension",
                                "Assignment?"
                            ].map((text, index) => (
                                <div
                                    key={index}
                                    className="text-7xl font-fredoka text-center text-white"
                                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                                >
                                    {text}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Button Container */}
                    <div className="max-w-xl mx-auto mt-16">
                        <Button
                            className="w-full bg-[#5B7BFE] hover:bg-[#4a6afe] text-white py-6 text-lg"
                            onClick={() => router.push("/comprehension/essay")}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Card, CardContent } from "@/components/ui/card";
import { ActivityCardProps } from "../types";
import Link from "next/link";

export function ActivityCard({ title, icon, description, link }: ActivityCardProps) {
    return (
        <Link href={link}>
            <Card className="bg-white/10 backdrop-blur-sm border-none hover:bg-white/15 transition-all">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="shrink-0">
                            <img src={icon} alt={title} className="w-12 h-12" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
                            <p className="text-gray-300">{description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

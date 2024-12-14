import { Container } from "@/core/components/container";
import { ActivityCardProps } from "../../types";
import { Header } from "../Header";
import { ActivityCard } from "../ActivityCard";


interface IDashboardDesktopView {
    activities: ActivityCardProps[];
}

export function DashboardDekstopView({ activities }: IDashboardDesktopView) {
    return (
        <Container>
            <Header />
            <main className="px-8 py-12 mt-8">
                <h2 className="text-4xl font-bold text-center text-white mb-12">
                    Choose Your Activity
                </h2>
                <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {activities.map((activity, index) => (
                        <ActivityCard key={index} {...activity} />
                    ))}
                </div>
            </main>
        </Container>
    );
}

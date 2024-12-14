import { Container } from "~/core/components/container";
import { Header } from "../Header";
import { ActivityCard } from "../ActivityCard";
import { ActivityCardProps } from "../../types";

interface IDashboardMobileView {
    activities: ActivityCardProps[];
}

export function DashboardMobileView({ activities }: IDashboardMobileView) {
    return (
        <Container>
            <Header />
            <main className="px-4 py-10 mt-6 min-h-screen bg-[#0A192F] pt-20">
                <h2 className="text-3xl font-bold text-center text-white mb-8">
                    Choose Your Activity
                </h2>
                <div className="flex flex-col gap-6">
                    {activities.map((activity, index) => (
                        <ActivityCard key={index} {...activity} />
                    ))}
                </div>
            </main>
        </Container>
    );
}

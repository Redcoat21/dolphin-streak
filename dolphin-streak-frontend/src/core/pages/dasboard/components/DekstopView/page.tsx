import { Container } from "~/core/components/container";
import { Header } from "../Header";
import { ActivityCard } from "../ActivityCard";
import { ActivityCardProps, LanguageSelectionProps } from "../../types";

interface DashboardDekstopViewProps extends LanguageSelectionProps {
    activities: ActivityCardProps[];
}

export function DashboardDekstopView({
    activities,
}: DashboardDekstopViewProps) {
    return (
        <Container>
            <Header />
            <main className="px-4 py-10 mt-6 min-h-screen bg-[#0b1120] pt-20">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white mb-8">
                        Choose Your Activity
                    </h2>
                    <div className="flex flex-col gap-6">
                        {activities.map((activity, index) => (
                            <ActivityCard key={index} {...activity} />
                        ))}
                    </div>
                </div>
            </main>
        </Container>
    );
}

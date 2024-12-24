import { Container } from "~/core/components/container";
import { Header } from "../Header";
import { ActivityCard } from "../ActivityCard";
import { ActivityCardProps, LanguageSelectionProps } from "../../types";
import { LanguageSelector } from "../LanguageSelector";

interface IDashboardMobileView extends LanguageSelectionProps {
    activities: ActivityCardProps[];
}

export function DashboardMobileView({ 
    activities,
    fromLanguage,
    toLanguage,
    onFromLanguageChange,
    onToLanguageChange,
    availableLanguages 
}: IDashboardMobileView) {
    return (
        <Container>
            <Header />
            <main className="px-4 py-10 mt-6 min-h-screen bg-[#0A192F] pt-20">
                <div className="mb-8">
                    <LanguageSelector
                        fromLanguage={fromLanguage}
                        toLanguage={toLanguage}
                        onFromLanguageChange={onFromLanguageChange}
                        onToLanguageChange={onToLanguageChange}
                        availableLanguages={availableLanguages}
                    />
                </div>
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

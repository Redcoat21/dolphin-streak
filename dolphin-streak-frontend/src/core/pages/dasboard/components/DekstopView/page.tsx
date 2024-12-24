import { ActivityCardProps, LanguageSelectionProps } from "../../types";
import { LanguageSelector } from "../LanguageSelector";

interface DashboardDekstopViewProps extends LanguageSelectionProps {
    activities: ActivityCardProps[];
}

export function DashboardDekstopView({
    activities,
    fromLanguage,
    toLanguage,
    onFromLanguageChange,
    onToLanguageChange,
    availableLanguages
}: DashboardDekstopViewProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3">
                    <LanguageSelector
                        fromLanguage={fromLanguage}
                        toLanguage={toLanguage}
                        onFromLanguageChange={onFromLanguageChange}
                        onToLanguageChange={onToLanguageChange}
                        availableLanguages={availableLanguages}
                    />
                </div>
                <div className="col-span-9">
                    <div className="grid grid-cols-3 gap-6">
                        {activities.map((activity, index) => (
                            <a
                                key={index}
                                href={activity.link}
                                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        src={activity.icon}
                                        alt={activity.title}
                                        className="w-16 h-16 mb-4"
                                    />
                                    <h3 className="text-xl font-semibold mb-2">
                                        {activity.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {activity.description}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

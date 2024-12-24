export interface ActivityCardProps {
    title: string;
    icon: string;
    description: string;
    link: string;
}

export interface LanguageOption {
    code: string;
    name: string;
}

export interface LanguageSelectionProps {
    fromLanguage: string;
    toLanguage: string;
    onFromLanguageChange: (language: string) => void;
    onToLanguageChange: (language: string) => void;
    availableLanguages: LanguageOption[];
}

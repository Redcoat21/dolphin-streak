import { LanguageSelectionProps } from "../../types";

export function LanguageSelector({
    fromLanguage,
    toLanguage,
    onFromLanguageChange,
    onToLanguageChange,
    availableLanguages
}: LanguageSelectionProps) {
    return (
        <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    I speak:
                </label>
                <select
                    value={fromLanguage}
                    onChange={(e) => onFromLanguageChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                >
                    {availableLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    I want to learn:
                </label>
                <select
                    value={toLanguage}
                    onChange={(e) => onToLanguageChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                >
                    {availableLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LanguageSelectionProps } from "../../types";

export function LanguageSelector({
    fromLanguage,
    toLanguage,
    onFromLanguageChange,
    onToLanguageChange,
    availableLanguages
}: LanguageSelectionProps) {
    return (
        <Card className="bg-white/10 backdrop-blur-sm border-none mt-5">
            <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                    <Label className="text-white">I speak:</Label>
                    <Select value={fromLanguage} onValueChange={onFromLanguageChange}>
                        <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {availableLanguages.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-white">I want to learn:</Label>
                    <Select value={toLanguage} onValueChange={onToLanguageChange}>
                        <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {availableLanguages.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}

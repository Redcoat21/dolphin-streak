// dolphin-streak-frontend\src\core\components\shared\LanguageMenu.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Language {
    _id: string;
    name: string;
    image: string;
}

interface LanguageMenuProps {
    languages: Language[];
    onFromLanguageChange: (language: Language | null) => void;
    onToLanguageChange: (language: Language | null) => void;
    selectedFromLanguage: Language | null;
    selectedToLanguage: Language | null;
    onNext: () => void;
}

export function LanguageMenu({
    languages,
    onFromLanguageChange,
    onToLanguageChange,
    selectedFromLanguage,
    selectedToLanguage,
    onNext,
}: LanguageMenuProps) {

    return (
        <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                    <Globe className="h-5 w-5" /> <span className="tracking-tight">Select Languages</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Choose the language you understand and the language you want to learn.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> {/* Increased gap for better spacing */}
                    <div>
                        <Label htmlFor="from-language" className="block mb-2 text-sm font-medium"> {/* Added font-medium for emphasis */}
                            I understand:
                        </Label>
                        <Select
                            onValueChange={(value) => onFromLanguageChange(languages.find(lang => lang.name.toLowerCase() === value) || null)}
                            value={selectedFromLanguage?.name.toLowerCase() || ''}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white rounded-md shadow-md"> {/* Improved SelectContent styling */}
                                {languages.map((lang) => (
                                    <SelectItem key={lang._id} value={lang.name.toLowerCase()} className="flex items-center space-x-3 py-2 px-3 hover:bg-gray-700 rounded-md transition-colors"> {/* Improved SelectItem styling */}
                                        <Avatar className="h-6 w-6"> {/* Slightly larger avatar */}
                                            <img
                                                src={lang.image}
                                                alt={`${lang.name} flag`} // More descriptive alt text
                                                className="rounded-full object-cover" // Ensure image covers the avatar space nicely
                                                loading="lazy" // Improve performance for image loading
                                            />
                                            <AvatarFallback>{lang.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{lang.name}</span> {/* Slightly smaller text for balance */}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="to-language" className="block mb-2 text-sm font-medium">
                            I want to learn:
                        </Label>
                        <Select
                            onValueChange={(value) => onToLanguageChange(languages.find(lang => lang.name.toLowerCase() === value) || null)}
                            value={selectedToLanguage?.name.toLowerCase() || ''}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white rounded-md shadow-md">
                                {languages.map((lang) => (
                                    <SelectItem key={lang._id} value={lang.name.toLowerCase()} className="flex items-center space-x-3 py-2 px-3 hover:bg-gray-700 rounded-md transition-colors">
                                        <Avatar className="h-6 w-6">
                                            <img
                                                src={lang.image}
                                                alt={`${lang.name} flag`}
                                                className="rounded-full object-cover"
                                                loading="lazy"
                                            />
                                            <AvatarFallback>{lang.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{lang.name}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button
                    variant="custom-blue"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-6" // Increased margin for better separation
                    onClick={onNext}
                    disabled={!selectedFromLanguage || !selectedToLanguage}
                >
                    Next: Select Level
                </Button>
            </CardContent>
        </Card>
    );
};
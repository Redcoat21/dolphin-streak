// dolphin-streak-frontend\src\core\components\shared\LevelMenu.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

interface Level {
    _id: string;
    name: string;
}

interface LevelMenuProps {
    levels: Level[];
    onLevelSelect: (level: Level | null) => void;
    onBack: () => void;
    onNext: () => void;
    selectedLevel: Level | null; // Add selectedLevel to props
}

export function LevelMenu({ levels, onLevelSelect, onBack, onNext, selectedLevel }: LevelMenuProps) {
    return (
        <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5" /> <span>Select Level</span>
                </CardTitle>
                <CardDescription className="text-gray-400">Select the difficulty level for the course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {levels.map((level) => (
                    <Button
                        key={level._id}
                        variant="custom-blue"
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        onClick={() => onLevelSelect(level)}
                    >
                        {level.name}
                    </Button>
                ))}
                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={onBack}>
                        Back to Languages
                    </Button>
                    <Button
                        variant="custom-blue"
                        className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        onClick={onNext}
                        disabled={!selectedLevel} // Use the passed selectedLevel prop
                    >
                        Next: Confirm Course
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
// dolphin-streak-frontend\src\core\pages\courses\page.tsx
import React, { useState, useCallback } from 'react';
import { LanguageMenu } from "@/core/components/shared/LanguageMenu";
import { LevelMenu } from "@/core/components/shared/LevelMenu";
import { Container } from "@/core/components/container";
import { useRouter } from 'next/router';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

enum CourseSetupStep {
  LANGUAGE,
  LEVEL,
  CONFIRMATION,
}

interface Language {
  _id: string;
  name: string;
  image: string;
}

interface Level {
  _id: string;
  name: string;
}

const initialLanguages: Language[] = [
  { _id: 'english', name: 'English', image: 'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png' },
  { _id: 'indonesian', name: 'Indonesian', image: 'https://cdn.countryflags.com/thumbs/indonesia/flag-3d-round-250.png' },
  { _id: 'chinese', name: 'Chinese', image: 'https://cdn.countryflags.com/thumbs/china/flag-3d-round-250.png' },
];

const initialLevels: Level[] = [
  { _id: '671afc7bc0a7ef4e76079383', name: 'Level 1' },
  { _id: '673229813b7d4ef48a342788', name: 'Level 2' },
];

export function CoursePage() {
  const [step, setStep] = useState<CourseSetupStep>(CourseSetupStep.LANGUAGE);
  const [fromLanguage, setFromLanguage] = useState<Language | null>(null);
  const [toLanguage, setToLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isConfirmationDrawerOpen, setIsConfirmationDrawerOpen] = useState(false);
  const router = useRouter();

  const handleNext = useCallback(() => {
    if (step === CourseSetupStep.LANGUAGE && fromLanguage && toLanguage) {
      setStep(CourseSetupStep.LEVEL);
    } else if (step === CourseSetupStep.LEVEL && selectedLevel) {
      setIsConfirmationDrawerOpen(true);
    }
  }, [step, fromLanguage, toLanguage, selectedLevel]);

  const handleBackToLanguage = useCallback(() => {
    setStep(CourseSetupStep.LANGUAGE);
  }, []);

  const handleCloseConfirmationDrawer = useCallback(() => {
    setIsConfirmationDrawerOpen(false);
  }, []);

  const handleConfirmCourse = useCallback(() => {
    setIsConfirmationDrawerOpen(false);
    router.push(`/courses/${fromLanguage?.name.toLowerCase()}-to-${toLanguage?.name.toLowerCase()}/${selectedLevel?.name.toLowerCase().replace(' ', '-')}`);
  }, [router, fromLanguage, toLanguage, selectedLevel]);

  const renderStepContent = () => {
    switch (step) {
      case CourseSetupStep.LANGUAGE:
        return (
          <LanguageMenu
            languages={initialLanguages}
            onFromLanguageChange={setFromLanguage}
            onToLanguageChange={setToLanguage}
            selectedFromLanguage={fromLanguage}
            selectedToLanguage={toLanguage}
            onNext={handleNext}
          />
        );
      case CourseSetupStep.LEVEL:
        return (
          <LevelMenu
            levels={initialLevels}
            onLevelSelect={setSelectedLevel}
            onBack={handleBackToLanguage}
            onNext={handleNext}
            selectedLevel={selectedLevel} // Pass selectedLevel here
          />
        );
      case CourseSetupStep.CONFIRMATION:
        return null;
      default:
        return null;
    }
  };

  return (
    <Container>
      <div className="min-h-screen bg-[#0b1120] text-white">
        <div className="max-w-4xl mx-auto space-y-8 mt-32 px-4 sm:px-6 lg:px-8">
          {renderStepContent()}
        </div>
        <Drawer open={isConfirmationDrawerOpen} onOpenChange={setIsConfirmationDrawerOpen} direction="bottom">
          <DrawerContent className="bg-gray-900 border-t border-gray-800 text-white">
            <DrawerHeader>
              <DrawerTitle>Are you sure?</DrawerTitle>
              <CardDescription className="text-gray-400">
                Start learning <strong>{toLanguage?.name}</strong> from <strong>{fromLanguage?.name}</strong> at <strong>{selectedLevel?.name}</strong>?
              </CardDescription>
            </DrawerHeader>
            <DrawerFooter className="sm:justify-start">
              <Button variant="outline" className="mr-2" onClick={handleCloseConfirmationDrawer}>
                No, go back
              </Button>
              <Button onClick={handleConfirmCourse}>Yes, start course</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </Container>
  );
}
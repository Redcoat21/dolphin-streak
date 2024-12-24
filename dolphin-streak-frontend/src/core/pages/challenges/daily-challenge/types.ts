export type ChallengeType = 'hanzi' | 'multiple-choice' | 'voice' | 'fill-blank';

export interface Challenge {
    id: string;
    type: ChallengeType;
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    chineseText?: string;
    pinyinText?: string;
    hanziCharacter?: string;
}

export interface DailyChallengeSet {
    date: string;
    challenges: Challenge[];
    currentIndex: number;
    completed: boolean;
    score: number;
}

export interface DailyChallengeState {
    currentSet: DailyChallengeSet | null;
    streak: number;
    totalScore: number;
}

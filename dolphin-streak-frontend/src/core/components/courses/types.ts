export interface BaseChallenge {
  id: string;
  type: 'voice' | 'multiple-choice' | 'hanzi';
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export interface VoiceChallenge extends BaseChallenge {
  type: 'voice';
  chineseText: string;
  pinyinText: string;
  correctAnswer: string;
  audioUrl?: string;
}

export interface MultipleChoiceChallenge extends BaseChallenge {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
}

export interface HanziChallenge extends BaseChallenge {
  type: 'hanzi';
  hanziCharacter: string;
  correctAnswer: string;
}

export type Challenge = VoiceChallenge | MultipleChoiceChallenge | HanziChallenge;

export interface DailyChallengeSet {
  date: string;
  challenges: Challenge[];
  currentIndex: number;
  completed: boolean;
  score: number;
}

export interface DailyChallengeState {
  currentSet: DailyChallengeSet;
  streak: number;
  totalScore: number;
}

export interface IQuestionTypeComponent {
    onSubmit: (answer: string | null) => void;
    lives: number;
    timeLeft: number;
}
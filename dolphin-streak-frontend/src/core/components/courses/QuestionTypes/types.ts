export interface IQuestionTypeComponent {
    // onSubmit: (answer: string | null) => void;
    // lives: number;
    // timeLeft: number;
}
export const isChinese = (text: string) => {
    return /[\u4e00-\u9fff]/.test(text);
};
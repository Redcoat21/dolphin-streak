// export enum QuestionType {
//     MULTIPLE_CHOICE = 0,
//     ESSAY = 1,
//     FILL_IN = 2,
//     VOICE = 3,
//     WRITING = 4,
// }

import { QuestionType } from "@/server/types/questions";

export const CourseTypeLabels = {
    0: "Basic",
    1: "Advanced"
};

export const QuestionTypeLabels = {
    [QuestionType.MULTIPLE_CHOICE]: "Multiple Choice",
    [QuestionType.ESSAY]: "Essay",
    [QuestionType.FILL_IN]: "Fill in the Blanks",
    [QuestionType.VOICE]: "Voice Recording",
    [QuestionType.WRITING]: "Writing"
};

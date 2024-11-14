import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsString,
    MaxLength,
    ValidateNested,
} from "class-validator";
import { ValidateAnswerOptions } from "../decorators/answer-options.decorator";
import { ValidateCorrectAnswer } from "../decorators/correct-answer.decorator";
import { QuestionType } from "../schemas/question.schema";

class QuestionDetailDto {
    @IsString()
    @MaxLength(50)
    type: string;

    @IsString()
    @MaxLength(500)
    text: string;

    @IsString()
    @MaxLength(500)
    voice: string;
}

export class CreateQuestionDto {
    @ValidateNested()
    @Type(() => QuestionDetailDto)
    question: QuestionDetailDto;

    @IsEnum(QuestionType)
    @IsNotEmpty()
    type: QuestionType;

    @IsArray()
    @IsNotEmpty()
    @ValidateAnswerOptions()
    answerOptions: string[];

    @IsNotEmpty()
    @ValidateCorrectAnswer()
    correctAnswer: number | string;

    @IsBoolean()
    @IsNotEmpty()
    useAi: boolean;

    @IsArray()
    @IsMongoId({ each: true })
    courses: string[];
}

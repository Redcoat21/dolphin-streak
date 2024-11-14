import { IsBoolean, IsEnum, IsMongoId, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { QuestionType } from "../schemas/question.schema";

export class QueryQuestionDto {
    @IsOptional()
    @Transform(({ value }) => {
        return Number(value);
    })
    @IsEnum(QuestionType)
    type?: QuestionType;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
    })
    useAi?: boolean;

    @IsOptional()
    @IsMongoId()
    courseId?: string;
}

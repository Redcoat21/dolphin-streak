import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";
import { Question } from "src/questions/schemas/question.schema";

export class LevelSessionDto {
    sessionId: string;
    userId: string;
    levelId: string;
    questions: Question[];
    expiresAt: Date;
}

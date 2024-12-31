import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsArray, IsDate, IsString } from "class-validator";
import { Question } from "src/questions/schemas/question.schema";

export class LevelSessionDto {
    @ApiProperty({
        description: "The session ID",
        example: "session-1691138855",
    })
    @IsString()
    @IsNotEmpty()
    sessionId: string;

    @ApiProperty({
        description: "The user ID",
        example: "612a4b7e8c4e2c001f1f8c5a",
    })
    @IsMongoId()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: "The level ID",
        example: "612a4b7e8c4e2c001f1f8c5b",
    })
    @IsMongoId()
    @IsNotEmpty()
    levelId: string;

    @ApiProperty({
        description: "The list of questions",
        type: [Question],
    })
    @IsArray()
    @IsNotEmpty()
    questions: Question[];

    @ApiProperty({
        description: "The expiration date of the session",
        example: "2024-11-25T15:47:01.890Z",
    })
    @IsDate()
    @IsNotEmpty()
    expiresAt: Date;
}
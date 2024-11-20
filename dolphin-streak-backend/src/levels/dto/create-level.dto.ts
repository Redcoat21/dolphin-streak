import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsString } from "class-validator";

export class CreateLevelDto {
    @ApiProperty({
        example: "Level 1",
        description: "The name of the level",
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: "612a4b7e8c4e2c001f1f8c5a",
        description:
            "The language of the level. Refers to the Language schema.",
    })
    @IsMongoId()
    language: string;
}

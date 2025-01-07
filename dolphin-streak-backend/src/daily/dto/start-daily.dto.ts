import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class StartDailyDto {
    @ApiProperty({
        description: "The language ID for the daily challenge",
        example: "6466074a442404418644b711",
    })
    @IsNotEmpty()
    @IsString()
    languageId: string;
}

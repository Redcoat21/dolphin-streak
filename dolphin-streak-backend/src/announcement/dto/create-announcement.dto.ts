import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAnnouncementDto {
    @ApiProperty({
        description: "The content of the announcement",
        example: "New English Course!",
    })
    @IsString()
    content: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class FindByIdParam {
    @ApiProperty({
        description: "The object's id",
        example: "60f7e4e3d6c2c6e3f",
        required: true,
        nullable: false,
    })
    @IsMongoId()
    id: string;
}

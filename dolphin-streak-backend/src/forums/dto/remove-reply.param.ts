import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class RemoveReplyParam {
    @ApiProperty({
        description: "The forum id",
        example: "6744262d52a2392a69fa49c3",
    })
    @IsMongoId()
    @IsNotEmpty()
    forumId: string;

    @ApiProperty({
        description: "The reply id",
        example: "6744262d52a2392a69fa49c3",
    })
    @IsMongoId()
    @IsNotEmpty()
    replyId: string;
}

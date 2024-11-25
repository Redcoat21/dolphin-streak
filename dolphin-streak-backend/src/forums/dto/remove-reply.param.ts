import { IsMongoId, IsNotEmpty } from "class-validator";

export class RemoveReplyParam {
    @IsMongoId()
    @IsNotEmpty()
    forumId: string;

    @IsMongoId()
    @IsNotEmpty()
    replyId: string;
}

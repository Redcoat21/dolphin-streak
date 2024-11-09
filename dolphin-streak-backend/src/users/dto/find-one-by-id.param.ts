import { IsMongoId } from "class-validator";

export class FindOneByIdParam {
    @IsMongoId()
    id: string;
}

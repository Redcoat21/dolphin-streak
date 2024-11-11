import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsMongoId, IsOptional } from "class-validator";

export class FindAllQuery {
    @IsOptional()
    @IsMongoId()
    language?: string;
}

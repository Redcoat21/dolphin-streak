import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsMongoId, IsOptional } from "class-validator";

export class FindAllLevelsQuery {
    @IsOptional()
    @IsMongoId()
    language?: string;
}

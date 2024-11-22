import { Module } from "@nestjs/common";
import { LevelsService } from "./levels.service";
import { LevelsController } from "./levels.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { LevelSchema } from "./schemas/level.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Level", schema: LevelSchema }]),
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
})
export class LevelsModule {}

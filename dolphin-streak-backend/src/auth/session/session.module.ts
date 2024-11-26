import { MongooseModule } from "@nestjs/mongoose";
import { SessionSchema } from "./schemas/session.schema";
import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: "Session",
            schema: SessionSchema,
        }]),
    ],
    providers: [SessionService],
    exports: [SessionService],
})
export class SessionModule {}

import { MongooseModule } from "@nestjs/mongoose";
import { SessionSchema } from "./schemas/session.schema";
import { forwardRef, Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: "Session",
            schema: SessionSchema,
        }]),
        forwardRef(() => UsersModule),
    ],
    providers: [SessionService],
    exports: [SessionService],
})
export class SessionModule {}

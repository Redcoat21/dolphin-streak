import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailService } from "./mail.service";
import { EncryptionModule } from "src/security/encryption.module";

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                return {
                    transport: {
                        port: configService.get<number>("MAIL_PORT"),
                        host: configService.get<string>("MAIL_HOST"),
                        secure: false,
                        auth: {
                            user: configService.get<string>("MAIL_USERNAME"),
                            pass: configService.get<string>("MAIL_PASSWORD"),
                        },
                    },
                    defaults: {
                        from: configService.get<string>("MAIL_FROM"),
                    },
                    template: {
                        dir: join(__dirname, "templates"),
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                };
            },
            inject: [ConfigService],
        }),
        EncryptionModule,
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}

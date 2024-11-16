import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    async sendPasswordResetMail(email: string, token: string): Promise<void> {
        const resetUrl = `${
            this.configService.get<string>("FRONTEND_URL")
        }/reset-password?token=${token}`;

        try {
            await this.mailerService.sendMail({
                to: email,
                subject: "Reset your password",
                template: "./password-reset",
                context: {
                    resetUrl,
                    supportEmail: this.configService.get("MAIL_FROM"),
                    expiresIn: "1 hour",
                },
            });

            this.logger.log(`Password reset email sent to ${email}`);
        } catch (error) {
            this.logger.error(
                `Failed to send password reset email to ${email}`,
                error.stack,
            );
            throw new Error("Failed to send password reset email");
        }
    }
}

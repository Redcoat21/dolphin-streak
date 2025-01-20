import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { EncryptionService } from "src/security/encryption.service";

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        private readonly encryptionService: EncryptionService,
    ) {}

    async sendPasswordResetMail(
        email: string,
        id: string,
        token: string,
    ): Promise<void> {
        const encryptedPayload = this.encryptionService.encryptPayload(
            id,
            token,
        );

        const resetUrl = `${
            this.configService.get<string>("FRONTEND_URL")
        }/auth/change-password/${encryptedPayload.encryptedData}?iv=${encryptedPayload.iv}`;

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
            console.log(error);
            throw new Error("Failed to send password reset email");
        }
    }
}

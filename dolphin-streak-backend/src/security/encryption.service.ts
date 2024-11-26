import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import crypto from "crypto";
import { EncryptedPayload } from "src/lib/types/response.type";

@Injectable()
export class EncryptionService {
    constructor(private readonly configService: ConfigService) {}

    private createHashedKey(
        key: string,
        algorithm: string = "sha256",
    ): Buffer {
        return crypto.createHash(algorithm).update(key).digest();
    }

    /**
     * Will return an iv and encrypted data in hex format.
     * @param id should be the id of the user
     * @param token should be the token that will be used to reset the password.
     * @returns the encrypted payload in the format of EncryptedPayload.
     * @see EncryptedPayload
     */
    encryptPayload(
        id: string,
        token: string,
    ): EncryptedPayload {
        const algorithm = "aes-256-cbc";
        // secretKey is the secret key used to encrypt the payload. Usually its in a plain string.
        const secretKey = this.configService.get<string>("AES_KEY");

        // 32 bytes key.
        const key = this.createHashedKey(secretKey);
        const iv = crypto.randomBytes(16);

        const encoding = "base64url";

        // Payload to be encrypted.
        const payload = `${id}:${token}`;

        // Create the cipher.
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        const encrypted = cipher.update(payload, "utf8", encoding) +
            cipher.final(encoding);

        return {
            iv: iv.toString(encoding),
            encryptedData: encrypted,
        };
    }

    async decryptPayload(
        encryptedToken: string,
        iv: string,
    ): Promise<string> {
        const algorithm = "aes-256-cbc";

        const secretKey = this.configService.get<string>("AES_KEY");
        const key = this.createHashedKey(secretKey);

        const encoding = "base64url";

        const ivBuffer = Buffer.from(iv, encoding);

        const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
        const decrypted = decipher.update(encryptedToken, encoding, "utf8") +
            decipher.final("utf8");

        return decrypted;
    }
}

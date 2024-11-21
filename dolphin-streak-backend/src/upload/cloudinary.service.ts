import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "profile-pictures",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                },
            );

            const buffer = Buffer.from(file.buffer);
            const stream = Readable.from(buffer);
            stream.pipe(uploadStream);
        });
    }
}

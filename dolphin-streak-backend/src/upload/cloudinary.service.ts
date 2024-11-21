import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { DateTime } from "luxon";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
        uniquePrefix: string = "uniquely_default",
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const timestamp = DateTime.now().toUnixInteger();
            const originalFilename = file.originalname.split(".")[0];
            const newFileName =
                `${uniquePrefix}-${originalFilename}-${timestamp}`;

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "profile-pictures",
                    public_id: newFileName,
                    format: "webp",
                    transformation: [
                        {
                            quality: "auto",
                            fetch_format: "webp",
                            width: 800,
                            crop: "limit",
                        },
                    ],
                    resource_type: "image",
                    unique_filename: true, // Ensure filename uniqueness
                    overwrite: false, // Prevent overwriting existing files
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

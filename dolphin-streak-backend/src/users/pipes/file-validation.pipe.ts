import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException("No file uploaded");
        }

        // Validate file size (5MB)
        // 5 * 1024 KB * 1024 B = 5 MB
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException("File size exceeds 5MB limit");
        }

        // Validate mime type
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                "Invalid file type. Only JPG, PNG, and WEBP files are allowed",
            );
        }

        return file;
    }
}

import { HttpException, HttpStatus } from "@nestjs/common";

export const formatPluralOrSingular = (length: number, word: string) => {
    return `${word}${length > 1 ? "s" : ""}`;
};

export const formatGetAllMessages = (length: number, word: string) => {
    return `${length} ${formatPluralOrSingular(length, word)} found`;
};

export const checkIfExist = (
    object: unknown,
    message: string,
    statusCode: number = HttpStatus.NOT_FOUND,
) => {
    if (!object) {
        throw new HttpException(message, statusCode);
    }
    return object;
};

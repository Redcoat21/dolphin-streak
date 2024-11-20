import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        // exception.getResponse().message will give out the error like the validation error.
        // If it doesnt exist, than means it must be not a validation error.
        //@ts-ignore
        const errorMessage = exception.getResponse().message ??
            exception.message;
        response
            .status(status)
            .json({
                //@ts-ignore
                messages: errorMessage,
                data: null,
            });
    }
}

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

        const errorMessage = status === 400
            //@ts-ignore
            ? exception.getResponse().message.reduce(
                (acc: string, curr: string) => acc += curr + " ",
                "",
            )
            : exception.message;

        response
            .status(status)
            .json({
                message: errorMessage,
                data: null,
            });
    }
}

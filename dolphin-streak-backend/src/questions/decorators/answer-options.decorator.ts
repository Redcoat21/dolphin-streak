import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from "class-validator";
import { QuestionType } from "../schemas/question.schema";

export function ValidateAnswerOptions(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "validateAnswerOptions",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const obj = args.object as any;
                    if (obj.type === QuestionType.MULTIPLE_CHOICE) {
                        return Array.isArray(value) && value.length === 4;
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    return "Multiple choice questions must have exactly 4 answer options";
                },
            },
        });
    };
}

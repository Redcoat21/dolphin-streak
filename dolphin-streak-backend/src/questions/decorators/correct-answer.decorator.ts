import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from "class-validator";
import { QuestionType } from "../schemas/question.schema";

export function ValidateCorrectAnswer(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "validateCorrectAnswer",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const obj = args.object as any;
                    if (obj.type === QuestionType.MULTIPLE_CHOICE) {
                        return typeof value === "number" && value >= 0 &&
                            value < 4;
                    }
                    return typeof value === "string";
                },
                defaultMessage(args: ValidationArguments) {
                    const obj = args.object as any;
                    if (obj.type === QuestionType.MULTIPLE_CHOICE) {
                        return "Correct answer must be a number between 0 and 3 for multiple choice questions";
                    }
                    return "Correct answer must be a string for this question type";
                },
            },
        });
    };
}

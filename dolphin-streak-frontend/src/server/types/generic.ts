export type TDefaultResponse<T> = {
    messages?: string | string[];
    message?: string | string[];
    data: T | null;
};

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export function isDefaultResponse<T>(response: unknown): response is TDefaultResponse<T> {
    return typeof response === 'object' && response !== null && 'data' in response;
}

export type TAnswerResult = {
    suggestion: string | null;
    isCorrect: boolean;
    isLatest: boolean;
};
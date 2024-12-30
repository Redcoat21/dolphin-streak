export type TDefaultResponse<T> = {
    messages?: string | string[];
    message?: string | string[]; 
    data: T | null;              
};
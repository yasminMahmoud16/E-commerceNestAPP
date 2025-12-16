import { IResponse } from "../interfaces";
export declare const successResponse: <T = any>({ data, message, status }?: IResponse<T>) => {
    message: string;
    status: number;
    data: T | undefined;
};

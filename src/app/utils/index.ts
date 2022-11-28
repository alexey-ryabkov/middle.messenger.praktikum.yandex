import {AppError} from "@models/types";

export function createAppError (msg : string, code = 0, module = '')
{
    return new Error(module ? `${module}: ${msg}` : msg, {cause: {code, msg}}) as AppError;
}

import {AppError} from "@models/types";

export function createAppError (msg : string, code = 0, module = '', additional? : string)
{
    return new Error( 
        module ? `${module}: ${msg}` : msg, 
        {
            cause: {code, msg, additional}
        } 
    ) as AppError;
}

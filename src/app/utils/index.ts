import {AppError, AppErrorCode} from "@models/types";

export function createAppError (msg : string, code = 0, module = '', additional? : string)
{
    return new Error( 
        module ? `${module}: ${msg}` : msg, 
        {
            cause: {code, msg, additional}
        } 
    ) as AppError;
}
export function getUserError (error : AppError)
{
    const {code, msg, additional} = error.cause;

    return AppErrorCode.userInput == code ? `${msg}${additional ? ` ${additional}` : ''}` : null;
}

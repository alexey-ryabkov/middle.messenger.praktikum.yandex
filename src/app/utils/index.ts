import SurChat from "@app";
import {AppError, AppErrorCode} from "@entities/types";

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
export function apiErrorHandler (error : Error) : never
{
    if (!('cause' in error))
    {
        // dev (no api?) error
        throw createAppError(error.message, AppErrorCode.unknown, 'actions');
    }
    const {code, msg, additional} = (error as AppError).cause;

    if (AppErrorCode.userInput == code)
    {
        // TODO can api/actions define user type error ?
        // just pass it through
        throw error;
    }
    else if (AppErrorCode.restApiRequest == code)
    {
        // wrong data input from user  
        throw createAppError(msg, AppErrorCode.userInput);
    }
    else if (AppErrorCode.restApiAuth == code)
    {
        const app = SurChat.instance;

        // we`re not authorized anymore ...
        if (app.storeState.currentUser)
        {
            // ... so reinit store if we`s authorized before
            app.resetStoreState(); 
        }

        // FIXME it will become uncaught besides auth form...
        throw createAppError(msg, AppErrorCode.userInput, '', additional);
    }
    else
        // dev (api) error
        throw createAppError(msg, AppErrorCode.dev, 'rest api (in controller)', additional);
}

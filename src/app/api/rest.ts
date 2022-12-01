import {PlainObject} from "@core/types";
import Http, {HttpOptsFull, HTTPMethods} from "@core/http";
import SurChat from "@app";
import {AppError, AppErrorCode} from "@models/types";
import {createAppError} from "@app-utils-kit"

const API_HOST = 'https://ya-praktikum.tech';
const API_BASE_URL = `${API_HOST}/api/v2`;

export function apiErrorHandler (error : Error) 
{
    if (!('cause' in error))
    {
        // dev? (no api) error
        throw createAppError(error.message, AppErrorCode.unknown, 'actions');
    }

    const {code, msg, additional} = (error as AppError).cause;

    if (AppErrorCode.restApiRequest == code)
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
    }
    else
    {
        // dev (api) error
        throw createAppError(msg, AppErrorCode.dev, 'rest api (in actions)', additional);
    }
}
/* TODO ошибка в клиентском коде
пропускаем только AppErrorCode.userInput, остальные мьютим, выводя в консоль 
export function userErrorHandler (error : AppError) 
{
    const {code, msg} = (error as AppError).cause;
    // rest api error [${code}]
    // console.error(`${msg}${ additional ? ` (${additional})` : '' }`);
} */

class RestApi extends Http
{
    constructor (apiPath = '') 
    {
        super(API_BASE_URL + apiPath);
    }
    get = (url? : string) => this._apiRequest(url);
    put = (url? : string, data : PlainObject = {}) => this._apiRequest(url, HTTPMethods.PUT, data);
    post = (url? : string, data : PlainObject = {}) => this._apiRequest(url, HTTPMethods.POST, data);
    delete = (url? : string, data : PlainObject = {}) => this._apiRequest(url, HTTPMethods.DELETE, data);

    protected _apiRequest (url = '', method : HTTPMethods = HTTPMethods.GET, data? : object, 
    // TODO
    isFormData = false) 
    {
        const options : HttpOptsFull = {
            method,
            responseType: 'json',
            headers: {}
        }
        // TODO form data for avatar
        // TODO options.headers['accept'] = 'application/json';

        if (data)
        {
            if (!isFormData)
            {
                options.data = JSON.stringify(data);
                // TODO
                options.headers['content-type'] = 'application/json; charset=utf-8';
            }
            else
                options.data = data;
        }
        return super._request(url, options)
                        .then(xhr => xhr.response)
                        .catch(error => 
                        {
                            // TODO use createAppError for http request aborted 
                            let code = error.cause?.code || 0;                            
                            const additional = error?.cause?.response?.error;
                            
                            let msg = error?.cause?.response?.reason;
                            if (!msg)
                            {
                                switch (code)
                                {
                                    case AppErrorCode.restApiRequest:
                                    case 409:
                                        code = AppErrorCode.restApiRequest;
                                        msg = 'bad request';
                                        break;

                                    case AppErrorCode.restApiAuth:
                                        msg = 'unauthorized';
                                        break;

                                    case AppErrorCode.restApiAccess:
                                        msg = 'no access';
                                        break;

                                    case AppErrorCode.restApiPath:
                                        msg = 'non-existent path';
                                        break;

                                    case AppErrorCode.restApiServer:
                                        msg = 'unexpected error';
                                        break;

                                    default:
                                        code = AppErrorCode.unknown;
                                        msg = 'unknown error';
                                        break;
                                }
                            }
                            throw createAppError(msg, code, 'rest api', additional);
                        });
    }
}
export const restAuthApi = new RestApi('/auth');
export const restUsersApi = new RestApi('/user');
export const restChatsApi = new RestApi('/chats');
export const restResourcesApi = new RestApi('/resources');

window.restAuthApi = restAuthApi;
window.restUsersApi = restUsersApi;
window.restChatsApi = restChatsApi;
window.restResourcesApi = restResourcesApi;

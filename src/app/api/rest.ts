import {PlainObject} from "@core/types";
import Http, {HttpOptsFull, HTTPMethods, HttpOpts} from "@core/http";
import SurChat from "@app";
import {AppError, AppErrorCode} from "@entities/types";
import {createAppError} from "@app-utils-kit"

const API_HOST = 'https://ya-praktikum.tech';
const API_BASE_URL = `${API_HOST}/api/v2`;

export function apiErrorHandler (error : Error) : never
{
    if (!('cause' in error))
    {
        // dev (no api) error
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
        // TODO вернуть 
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

type RestApiData = FormData | PlainObject;
type RestApiMethod = (url? : string, data? : RestApiData) => Promise< any >;

export default class RestApi 
{
    protected _http : Http;

    constructor (
        apiPath = '', 
        protected _requestOpts : HttpOpts = {},
        apiBaseUrl = API_BASE_URL) 
    {
        this._http = new Http( apiBaseUrl + apiPath );
    }
    get baseUrl ()
    {
        return this._http.BASE_URL;
    }
    get : RestApiMethod = (url) => this._request(url);
    put : RestApiMethod = (url, data = {}) => this._request(url, HTTPMethods.PUT, data);
    post : RestApiMethod = (url, data = {}) => this._request(url, HTTPMethods.POST, data);
    delete : RestApiMethod = (url, data = {}) => this._request(url, HTTPMethods.DELETE, data);

    protected _request (url = '', method : HTTPMethods = HTTPMethods.GET, data? : RestApiData) 
    {
        const options : HttpOptsFull = {
            ...{
                method,
                responseType: 'json',
                headers: {},
                credentials: true,
            }, 
            ...this._requestOpts};

        if (data)
        {
            if (data instanceof FormData)
            {
                options.data = data;
            }
            else
            {
                options.data = JSON.stringify(data);                
                options.headers = {'content-type': 'application/json; charset=utf-8'};
            }
        }        
        return this._http.request(url, options)
            .then(xhr => xhr.response)
            .catch(error => 
            {
                let code = error.cause?.code || 0;                            
                let msg = error?.cause?.response?.reason;
                const additional = error?.cause?.response?.error;

                switch (code)
                {
                    case AppErrorCode.restApiRequest:
                    case 409:
                        code = AppErrorCode.restApiRequest;
                        msg = msg || 'bad request';
                        break;

                    case AppErrorCode.restApiAuth:
                        msg = msg || 'unauthorized';
                        break;

                    case AppErrorCode.restApiAccess:
                        msg = msg || 'no access';
                        break;

                    case AppErrorCode.restApiPath:
                        msg = msg || 'non-existent path';
                        break;

                    case AppErrorCode.restApiServer:
                        msg = msg || 'unexpected error';
                        break;

                    default:
                        code = AppErrorCode.unknown;
                        msg = msg || 'unknown error';
                        break;
                }
                throw createAppError(msg, code, 'rest api', additional);
            });
    }
}
export const restAuthApi = new RestApi('/auth');
export const restUsersApi = new RestApi('/user');
export const restChatsApi = new RestApi('/chats');
export const restResourcesApi = new RestApi('/resources');

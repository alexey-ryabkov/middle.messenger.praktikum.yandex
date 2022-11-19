import Http, {HttpOptsFull, Methods} from "@models/http";
import {PlainObject} from "@models/types";
// import {isJsonString} from "@lib-utils-kit";

const API_HOST = 'https://ya-praktikum.tech';
const API_BASE_URL = `${API_HOST}/api/v2`;

export default class RestApi extends Http
{
    constructor (apiPath = '') 
    {
        super(API_BASE_URL + apiPath);
    }
    get = (url? : string) => this._apiRequest(url);
    put = (url? : string, data : PlainObject = {}) => this._apiRequest(url, Methods.PUT, data);
    post = (url? : string, data : PlainObject = {}) => this._apiRequest(url, Methods.POST, data);
    delete = (url? : string, data : PlainObject = {}) => this._apiRequest(url, Methods.DELETE, data);

    protected _apiRequest (url = '', method : Methods = Methods.GET, data? : object, isFormData = false) 
    {
        const options : HttpOptsFull = {
            method,
            responseType: 'json',
            headers: {}
        }
        // options.headers['accept'] = 'application/json';

        if (data)
        {
            if (!isFormData)
            {
                options.data = JSON.stringify(data);
                options.headers['content-type'] = 'application/json; charset=utf-8';
            }
            else
                options.data = data;
        }

        return super._request(url, options)
                        .then(xhr => xhr.response)
                        .catch(error => 
                        {
                            // TODO в эту конструкцию также вещи типа http request aborted 
                            let code = error.cause?.code || 0;
                            let msg = error?.cause?.response?.reason;
                            if (!msg)
                            {
                                switch (code)
                                {
                                    case 400:
                                        msg = 'bad request';
                                    break;

                                    case 401:
                                        msg = 'unauthorized';
                                    break;

                                    case 500:
                                        msg = 'unexpected error';
                                    break;

                                    default:
                                        code = 0;
                                        msg = 'unknown error';
                                    break;
                                }
                            }
                            console.error(code, `rest api: ${msg}`);
                            // TODO подумать пробрасывать ли ошибку дальше 
                            // TODO еще бывает поле error 
                            //Error(`rest api: ${msg}`, {cause: {code, msg}});
                        });
    }
}
export const restAuthApi = new RestApi('/auth');
export const restUsersApi = new RestApi('/user');
export const restChatsApi = new RestApi('/chats');
export const restResourcesApi = new RestApi('/resources');

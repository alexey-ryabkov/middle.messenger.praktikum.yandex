import {isJsonString} from '../utils'

export function httpQueryStringify (data : Record< string, any >) 
{
    return Object.entries(data).map( ([key, value]) => `${key}=${value}` ).join('&');
}

export enum Methods {
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    DELETE = 'DELETE'
}
export type HttpOpts = 
{
    data? : any,
    headers? : Record< string, string >,
    timeout? : number,
    // dataType?: 'json' | 'formdata',
    responseType?: 'json' | 'text' | 'document' | 'blob' | 'arraybuffer',
    credentials?: boolean,
}
export type HttpOptsFull = HttpOpts &
{
    method? : Methods
}
export default class Http
{
    constructor (
        protected _baseUrl : string = ''
    ) {}
    get (url : string, options : HttpOpts = {}) 
    {
        const {data} = options;

        if (typeof data == 'object') 
        {
            const stringifiedQuery = httpQueryStringify( data as Record< string, any > );

            if (stringifiedQuery)
            {
                url += ( url.includes('?') ? '&' : '?' ) + stringifiedQuery;
            }
        }        
        return this._request( url, {...options, method: Methods.GET} );    
    }
    put = (url : string, options : HttpOpts = {}) => this._request(url, {...options, method: Methods.PUT});
    post = (url : string, options : HttpOpts = {}) => this._request(url, {...options, method: Methods.POST});
    delete = (url : string, options : HttpOpts = {}) => this._request(url, {...options, method: Methods.DELETE});

    protected _request (url : string, options : HttpOptsFull = {}) 
    {
        const {
            method = Methods.GET, 
            data, 
            headers = {}, 
            timeout = 5000, 
            // dataType,
            responseType = '',
            credentials = true,
        } = options;

        const isGetMethod = Methods.GET == method;

        url = this._baseUrl + url;

        return new Promise<XMLHttpRequest>((resolve, reject) => 
        {
            const xhr = new XMLHttpRequest();

            xhr.open(method, url);
            xhr.timeout = timeout;
            xhr.responseType = responseType;
            xhr.withCredentials = credentials;

            //  'accept: application/json'
            // TODO

            xhr.onload = () => 
            {
                // console.log(xhr);                

                if (xhr.status >= 400)
                {
                    const errorText = xhr.statusText;
                    const {status: code, response} = xhr;

                    reject( Error( `http bad request${errorText ? ` (${errorText})` : ''}, code ${code}`, {cause: { code, response }} ));
                }
                else
                    resolve(xhr);
            }
            xhr.onabort = () => reject( Error('http request aborted') );
            xhr.onerror = () => reject( Error('http bad request') );
            xhr.ontimeout = () => reject( Error('http request timeout') );

            if (headers)
            {
                Object.entries(headers).forEach(([name, value]) => xhr.setRequestHeader(name, value));
            }

            // if ('json' == dataType)
            // {
            //     xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
            // }
            // else if ('formdata' == dataType)
            // {
            //     xhr.setRequestHeader('content-type', 'multipart/form-data');
            // }
            // if (typeof data == 'string' && data.length && isJsonString(data)) 
            // {
            //     xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            // }

            if (!isGetMethod)
            {
                xhr.send(data);
            } 
            else
                xhr.send();
        });      
    }
}

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
export type HttpTranspOpts = 
{
    data? : any,
    headers? : Record< string, string >,
    timeout? : number
}
export type HttpTranspOptsFull = HttpTranspOpts &
{
    method? : Methods
}

export default class HttpTransport
{
    get = (url : string, options : HttpTranspOpts = {}) => 
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
        this._request( url, {...options, method: Methods.GET} );    
    }
    put = (url : string, options : HttpTranspOpts = {}) => this._request(url, {...options, method: Methods.PUT});
    post = (url : string, options : HttpTranspOpts = {}) => this._request(url, {...options, method: Methods.POST});
    delete = (url : string, options : HttpTranspOpts = {}) => this._request(url, {...options, method: Methods.DELETE});

    protected _request = (url : string, options : HttpTranspOptsFull = {}) => 
    {
        const {method = Methods.GET, data, headers = {}, timeout = 5000} = options;
        const isGetMethod = Methods.GET == method;

        return new Promise((resolve, reject) => 
        {
            const xhr = new XMLHttpRequest();

            xhr.open(method, url);
            xhr.timeout = timeout;

            xhr.onload = () => resolve(xhr);
            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;

            if (headers)
            {
                Object.entries(headers).forEach(([name, value]) => xhr.setRequestHeader(name, value));
            }
            if (typeof data == 'string' && data.length && isJsonString(data)) 
            {
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            }

            if (!isGetMethod)
            {
                xhr.send(data);
            } 
            else
                xhr.send();
        });      
    };
}

import {isJsonString} from '../utils'

export function queryStringify (data = {}) 
{
return Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&');
}

export function httpQueryStringify (data : Record< string, any >) 
{
    const keys = Object.keys(data);
    
    return keys.reduce((result, key, index) => 
    {
        return `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`;
    }, '?');
}
export enum Methods {
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    DELETE = 'DELETE'
}
type HttpTransportOptions = 
{
    method? : Methods,
    data? : any,
    headers? : Record< string, string >,
    timeout? : number
}
export default class HttpTransport
{
    get = (url : string, options : HttpTransportOptions = {}) => this.request(url, {...options, method: Methods.GET}, options.timeout);

    put = (url : string, options : HttpTransportOptions = {}) => this.request(url, {...options, method: Methods.PUT}, options.timeout);

    post = (url : string, options : HttpTransportOptions = {}) => this.request(url, {...options, method: Methods.POST}, options.timeout);

    delete = (url : string, options : HttpTransportOptions = {}) => this.request(url, {...options, method: Methods.DELETE}, options.timeout);

    request = (url = '/', options : HttpTransportOptions = {}, timeout = 5000) => 
    {
        const {method = Methods.GET, data = {}, headers = {}} = options;

        return new Promise((resolve, reject) => 
        {
            const xhr = new XMLHttpRequest();

            if (Methods.GET == method && typeof data == 'object') 
            {
                url += '?'+queryStringify(data as Record< string, any >);
            }
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
            if ('string' == typeof data && isJsonString(data)) 
            {
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            }

            xhr.send(data);
        });      
    };
}

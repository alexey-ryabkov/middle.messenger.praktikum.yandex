export function httpQueryStringify (data : Record< string, any >) 
{
    return Object.entries(data).map( ([key, value]) => `${key}=${value}` ).join('&');
}
export enum HTTPMethods {
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
    responseType?: 'json' | 'text' | 'document' | 'blob' | 'arraybuffer',
    credentials?: boolean,
}
export type HttpOptsFull = HttpOpts &
{
    method? : HTTPMethods
}
export default class Http
{
    constructor (
        public readonly API_BASE_URL : string = ''
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
        return this._request( url, {...options, method: HTTPMethods.GET} );    
    }
    put = (url : string, options : HttpOpts = {}) => this._request(url, {...options, method: HTTPMethods.PUT});
    post = (url : string, options : HttpOpts = {}) => this._request(url, {...options, method: HTTPMethods.POST});
    delete = (url : string, options : HttpOpts = {}) => this._request(url, {...options, method: HTTPMethods.DELETE});

    protected _request (url : string, options : HttpOptsFull = {}) 
    {   
        const {
            method = HTTPMethods.GET, 
            data, 
            headers = {}, 
            timeout = 5000, 
            // dataType,
            responseType = '',
            credentials = true,
        } = options;

        const isGetMethod = HTTPMethods.GET == method;

        url = this.API_BASE_URL + url;
        console.log('RestApi request', url, options);

        return new Promise< XMLHttpRequest >((resolve, reject) => 
        {
            const xhr = new XMLHttpRequest();

            xhr.open(method, url);
            xhr.timeout = timeout;
            xhr.responseType = responseType;
            xhr.withCredentials = credentials;

            xhr.onload = () => 
            {
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

            if (!isGetMethod)
            {
                xhr.send(data);
            } 
            else
                xhr.send();
        });      
    }
}

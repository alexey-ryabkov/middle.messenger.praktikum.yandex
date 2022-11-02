import {isJsonString} from '../utils'

export function queryStringify (data = {}) 
{
  return Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&');
}

// httpQueryStringify (data) 
// {
//     if (typeof data !== 'object') {
//         throw new Error('Data must be object');
//     }

//     const keys = Object.keys(data);
//     return keys.reduce((result, key, index) => {
//       return `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`;
//     }, '?');
// }
const METHODS = {
    GET: 'GET',
    PUT: 'PUT',
    POST: 'POST',
    DELETE: 'DELETE',
};
export default class HttpTransport
{
    get = (url, options = {}) => 
  {     
    return this.request(url, {...options, method: METHODS.GET}, options.timeout);
  };
  put = (url, options = {}) => 
  {     
    return this.request(url, {...options, method: METHODS.PUT}, options.timeout);
  };
  post = (url, options = {}) => 
  {     
    return this.request(url, {...options, method: METHODS.POST}, options.timeout);
  };
  delete = (url, options = {}) => 
  {     
    return this.request(url, {...options, method: METHODS.DELETE}, options.timeout);
  };
  request = (url = '/', options = {}, timeout = 5000) => 
  {
    const {method = METHODS.GET, data, headers = {}} = options;

    return new Promise((resolve, reject) => 
    {
        const xhr = new XMLHttpRequest();

        if (METHODS.GET == method && typeof data == 'object') // это лучше вынести в get
        {
          url += '?'+queryStringify(data);
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

        if ('string' == typeof data && isJsonString(data)) // 
        {
          xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        }
        // мб тут надо так
        //  if (method === METHODS.GET || !data) {
	      //   xhr.send();
	      // } else {
	      //   xhr.send(JSON.stringify(data));
	      // }

        xhr.send(data);
    });      
  };
}

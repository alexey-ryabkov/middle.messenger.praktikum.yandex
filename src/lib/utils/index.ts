import {SingleOrPlural, Plural} from '@models/types';

export const unique = (item : any[]) : any[] => [...new Set(item)];

export const dummyQuery = (data:object, delay = 1000) => new Promise(resolve => setTimeout(() => resolve(data), delay)); 

export const isPlural = (item : SingleOrPlural<any>) : item is Plural<any> => !Array.isArray(item);

export function isJsonString (str:string) : boolean 
{
    try {
        JSON.parse(str);
    } 
    catch {
        return false;
    }
    return true;
}
export function getHashNum (value : string) : number
{
    let hash = 0;
    for (let i = 0; i < value.length; i++) 
    {
        const chr   = value.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}
export function plural2Arr (item : SingleOrPlural<any>) : Array<any> 
{
    if (!isPlural(item))
    {
        item = [item];
    } 
    return Array.from(item);
}
export function toArr<T> (item: Iterable<T>) : T[] 
{
    return [...item]; 
}

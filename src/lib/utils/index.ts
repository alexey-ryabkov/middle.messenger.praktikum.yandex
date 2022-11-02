import {SingleOrPlural, Plural} from '@models/types';
// import InputText from '@lib-components/input-text';

export const unique = (item : any[]) : any[] => [...new Set(item)];
// arr.filter( (item, i, arr) => arr.indexOf(item) == i )
// export const addMixin = (item : any, mixin : object) : void => Object.assign(item, mixin);

export const dummyQuery = (data:object, delay:number = 1000) => new Promise(resolve => setTimeout(() => resolve(data), delay)); 

export const isPlural = (item : SingleOrPlural<any>) : item is Plural<any> => !Array.isArray(item);

export function isJsonString (str:string):boolean 
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
        let chr   = value.charCodeAt(i);
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
export function toArr<T> (item: Iterable<T>): T[] 
{
    return [...item]; 
}

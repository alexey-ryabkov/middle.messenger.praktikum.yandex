import {SingleOrPlural, Plural, PlainObject} from '@models/types';

export const unique = (item : any[]) : any[] => [...new Set(item)];

export const dummyQuery = (data:object, delay = 1000) => new Promise(resolve => setTimeout(() => resolve(data), delay)); 

export const isPlural = (item : SingleOrPlural<any>) : item is Plural<any> => !Array.isArray(item);

export function isPlainObject (value: unknown): value is PlainObject 
{
    return typeof value === 'object'
        && value !== null
        && value.constructor === Object
        && Object.prototype.toString.call(value) === '[object Object]';
}
export function isArray (value: unknown) : value is [] 
{
    return Array.isArray(value);
}
export function isArrayOrObject (value: unknown) : value is [] | PlainObject 
{
    return isPlainObject(value) || isArray(value);
}
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
export function freezeEvent (event : Event) 
{
    event.preventDefault();
    event.stopPropagation();
}
export function objFromPropPath (propPath : string, value : unknown = {}) : object
{
	if (!propPath)
    {
        return {};
    }
    if (typeof value == 'undefined')
    {
        value = {};
    }
    return propPath
			.trim().split('.')
			.reverse()
			.reduce( (result, part) => ({ [part]: result }), value ) as object;
}
export function merge (lhs : PlainObject, rhs : PlainObject) : PlainObject 
{
    Object.entries(rhs).forEach(([prop, value]) => 
    {
        if (prop in lhs) 
        {
            if (
                lhs[prop] instanceof Object
                &&
                value instanceof Object
            ) {
                merge(lhs[prop] as PlainObject< object >, value as PlainObject< object >);
            }
            else 
                lhs[prop] = value;
        }
        else
            lhs[prop] = value;
    });
    return lhs;
}
export function setValInPath (obj: PlainObject | unknown, path: string, value: unknown): PlainObject | unknown 
{
    if (!(obj instanceof Object))
    {
        return {};
    }
    return merge(
        obj as PlainObject< object >, 
        objFromPropPath(path, value) as PlainObject< object >);
}
export function trim (str : string, trimSymbols? : string)
{
    if (!trimSymbols) 
    {
        return str.trim();
    }

    const uniSymbolsRegexp = /(\\x[0-9a-f]{2}|\\u[0-9a-f]{4}|\\u\{[0-9a-f]+\})/gi;
    const uniSymbolsArr : string[] | null = trimSymbols.match(uniSymbolsRegexp);
    if (uniSymbolsArr)
    {
        trimSymbols = trimSymbols.replace(uniSymbolsRegexp, '');
    }

    let symbolsArr : string[] = [];
    if (trimSymbols)
    {
        symbolsArr = [...(trimSymbols as string)].map(item => '\\'+item);
        symbolsArr.push('\\ '); 
    }

    const trimSymbolsArr = [...(uniSymbolsArr ?? []), ...symbolsArr];
    const trimRegexpClsSymbols = [...new Set(trimSymbolsArr)].join('');

    return str.replace(new RegExp(`(?:^[${trimRegexpClsSymbols}]*)|(?:[${trimRegexpClsSymbols}]*$)`), '');
}
export function isEqual (a: PlainObject, b: PlainObject): boolean 
{
    if (String(Object.keys(a)) != String(Object.keys(b)))
    {
        return false;
    }
    return Object.keys(a).every(prop => 
    {
        const propA = a[prop];
        const propB = b[prop];

        if (propA === propB)
        {
            return true;
        }
        else if (
            propA instanceof Object
            &&
            propB instanceof Object
        ) 
        {
            return isEqual(propA as PlainObject, propB as PlainObject);
        }
        else
            return false;
    });
}
export function cloneDeep (obj : [] | PlainObject = {}) 
{
    let cloned : unknown[] | PlainObject; 
   
    if (isPlainObject(obj))
    {
        cloned = {};
        for (const [prop, value] of Object.entries(obj as PlainObject)) 
        {
            if (isArrayOrObject(value)) 
            {
                cloned[prop] = cloneDeep(value);
            }
            else
                cloned[prop] = value;
        }
    }
    else
    {
        cloned = [];
        
        obj.forEach((value, key) => 
        {
            if (isArrayOrObject(value)) 
            {
                cloned[key] = cloneDeep(value);
            }
            else
                cloned[key] = value;
        });
    }
    return cloned;
}

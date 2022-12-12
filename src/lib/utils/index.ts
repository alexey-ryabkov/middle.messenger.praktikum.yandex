import {SingleOrPlural, Plural, PlainObject} from '@core/types';

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
export function setValInPath (obj : PlainObject | unknown, path : string, value : unknown): PlainObject | unknown 
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
export function isEqual (a: PlainObject, b: PlainObject) 
{
    if (Object.keys(a).length !== Object.keys(b).length) 
    {
        return false;
    }
    for (const [key, value] of Object.entries(a)) 
    {
        const bValue = b[key];

        if (isArrayOrObject(value) && isArrayOrObject(bValue)) 
        {
            // @ts-ignore
            if (isEqual( value, bValue )) 
            {
                continue;
            }
            return false;
        }
        if (value !== bValue) 
        {
            return false;
        }
    }
    return true;
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
                // @ts-ignore
                cloned[key] = cloneDeep(value);
            }
            else
                // @ts-ignore
                cloned[key] = value;
        });
    }
    return cloned;
}
export function datePrettify (date : Date, withTime = false)
{
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const TODAY_MS = today.getTime();
    const DAY_AGO_MS = 60*60*24*1000;
    const AVAREGE_MONTH_DAYS = 29.3;
    const SIX_DAYS_AGO_MS = DAY_AGO_MS*6;
    const ELEVEN_MONTHS_AGO_MS = AVAREGE_MONTH_DAYS*DAY_AGO_MS*11;
    
    const almostWeekAgo = new Date(TODAY_MS - SIX_DAYS_AGO_MS);
    const almostYearAgo = new Date(TODAY_MS - ELEVEN_MONTHS_AGO_MS);

    const weekDays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля',
        'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}`;

    let prettified = '';
    if (date > today)
    {
        return time;
    }
    else if (date > almostWeekAgo)
    {
        prettified = weekDays[date.getDay()];
    }
    else if (date > almostYearAgo)
    {
        prettified = `${date.getDate()} ${monthNames[date.getMonth()]}`; 
    }
    else 
    {
        const day = date.getDate();
        const month = date.getMonth() + 1;

        prettified = `${day > 9 ? day : `0${day}`}.${month > 9 ? month : `0${month}`}.${date.getFullYear()}`;
    }
    return prettified + (withTime ? ` ${time}` : '');
}
export function waiter (time = 1000)
{
    return new Promise< void >(resolver =>
    {
        setTimeout(() =>
        {
            resolver();
        }, 
        time);
    })
}

import {Handler} from '@models/types';

export default class EventBus
{
    listeners : Record< string, Handler[] >;

    constructor() 
    {
        this.listeners = {};
    }
    on (event : string, callback : Handler) 
    {
        if (!(event in this.listeners))
        {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    off (event : string, callback : Handler) 
    {
        if (event in this.listeners) 
        {
            this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
        }
    }
    emit (event : string, ...args: any[]) 
    {
        if (event in this.listeners) 
        {
            this.listeners[event].forEach(listener => listener(...args));
        }
        else
            throw `Error: no event with name ${event}`;
    }
}

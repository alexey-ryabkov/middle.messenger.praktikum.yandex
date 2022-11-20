import {Handler} from '@core/types';

export default class EventBus
{
    protected _listeners : Record< string, Handler[] >;
    protected _oneTimes : Record< string, Handler[] >;

    constructor() 
    {
        this._listeners = {};
        this._oneTimes = {};
    }
    on (event : string, callback : Handler) 
    {
        if (!(event in this._listeners))
        {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
        return this;
    }
    off (event : string, callback : Handler) 
    {
        if (event in this._listeners) 
        {
            this._listeners[event] = this._listeners[event].filter(listener => listener !== callback);
        }
        if (event in this._oneTimes) 
        {
            this._oneTimes[event] = this._oneTimes[event].filter(listener => listener !== callback);
        }
        return this;
    }
    oneTime (event : string, callback : Handler)
    {
        if (!(event in this._oneTimes))
        {
            this._oneTimes[event] = [];
        }
        this._oneTimes[event].push(callback);
        return this;
    }
    emit (event : string, ...args: any[]) 
    {
        if (event in this._listeners) 
        {
            this._listeners[event].forEach(listener => listener(...args));
        }
        if (event in this._oneTimes) 
        {
            this._oneTimes[event].forEach(listener => 
            {
                listener(...args);
            });
            delete this._oneTimes[event];
        }
    }
}

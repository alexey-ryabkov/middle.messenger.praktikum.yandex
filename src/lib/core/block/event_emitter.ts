
import {SingleOrPlural, Handler, CEventLsnr} from '@core/types';
import {plural2Arr} from '@lib-utils-kit';

export default abstract class EventEmitter
{       
    protected _listeners : Record< string, Set< Handler >>;

    constructor() 
    {
        this._listeners = {};
    }
    get availEvents ()
    {
        return this._availEvents;
    }
    on (lsnrs : SingleOrPlural< CEventLsnr >) 
    {
        plural2Arr(lsnrs).forEach(lsnr => 
        {
            this._listeners[lsnr.name].add(lsnr.handler);
        });
    }
    off (lsnrs : SingleOrPlural< CEventLsnr >) 
    {
        plural2Arr(lsnrs).forEach(lsnr => 
        {
            this._listeners[lsnr.name].delete(lsnr.handler);
        });
    }
    protected emit (eventName : string, ...args: any[]) 
    {
        if (eventName in this.availEvents) 
        {
            this._listeners[eventName].forEach(handler => handler(...args));
        }
        else
            throw `Error: no event with name ${eventName}`;
    }
    protected abstract get _availEvents () : string[]; 
}

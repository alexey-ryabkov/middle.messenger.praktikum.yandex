import {SingleOrPlural, Handler, CEventLsnr} from '../models/types';
import {plural2Arr} from '../utils';

export default class EventBus
{
    protected _listeners : Record< string, Set< Handler >>;

    constructor() 
    {
        this._listeners = {};
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
    emit (eventName : string, ...args) 
    {
        if (eventName in this._listeners) 
        {
            this._listeners[eventName].forEach(handler => handler(...args));
        }
        else
            throw `Error: no event with name ${eventName}`;
    }
}

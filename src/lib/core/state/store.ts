// import EventEmitter from "@models/event_emitter";
import EventBus from "@core/event_bus";
import {PlainObject} from "@core/types";
import {setValInPath} from "@lib-utils-kit";

// export interface Stateful 
// {
//     get state () : PlainObject;
//     set (path: string, value: unknown) : void;
// }
export enum StoreEvents {
    added = 'added',
    updated = 'updated',
    deleted = 'deleted',
    cleared = 'cleared'
}
export default class Store extends EventBus // implements Stateful // EventEmitter
{
    constructor (
        protected _state : PlainObject = {}
    ) {
        super();
    }
    get state ()
    {
        return this._state;
    }
    // TODO этот метод не нужен
    get (path: string)
    {
        return path.trim().split('.').reduce( (result, pathPart) => 
        {
            if (result && pathPart in result)
            {
                return result[pathPart];
            }
            else
                return null;
        }, 
        this._state);
    }
    set (path: string, value: unknown)
    {
        setValInPath(this._state, path, value);

        this.emit( StoreEvents.updated );

        let partOfPath = '';
        path.split('.').forEach(part => 
        {
            partOfPath = !partOfPath ? part : `${partOfPath}.${part}`;

            // TODO передавтаь значение вместе с emit ? 
            this.emit( Store.getEventName4path(partOfPath), this.get(path) );
        });
        
    }
    clear ()
    {
        this._state = {};
        this.emit( StoreEvents.updated );
        this.emit( StoreEvents.cleared );        
    }
    static getEventName4path (path: string, event : StoreEvents = StoreEvents.updated)
    {
        return `${event}:${path}`;
    }
}

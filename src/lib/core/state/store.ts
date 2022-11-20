// import EventEmitter from "@models/event_emitter";
import EventBus from "@core/event_bus";
import {PlainObject} from "@core/types";
import {setValInPath} from "@lib-utils-kit";

export interface Stateful 
{
    get state () : PlainObject;
    set (path: string, value: unknown) : void;
}
export enum StoreEvents {
    added = 'added',
    updated = 'updated',
    deleted = 'deleted',
}
export class Store extends EventBus implements Stateful // EventEmitter
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
    set (path: string, value: unknown)
    {
        setValInPath(this._state, path, value);

        let partOfPath = '';
        path.split('.').forEach(part => 
        {
            partOfPath = !partOfPath ? part : `${partOfPath}.${part}`;

            this.emit( Store.getEventName4path(partOfPath) );
        });
    }
    static getEventName4path (path: string, event : StoreEvents = StoreEvents.updated)
    {
        return `${event}:${path}`;
    }
}

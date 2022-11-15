// import EventEmitter from "@models/event_emitter";
import EventBus from "@models/event_bus";
import {Indexed} from "@models/types";

export enum StoreEvents {
    Updated = 'updated',
}

export default class Store extends EventBus // EventEmitter
{
    constructor (
        protected _state : Indexed = {}
    ) {
        super();
    }
    get state ()
    {
        return this._state;
    }
    set (path: string, value: unknown)
    {
        // @todo слитие объектов 
        this.emit(StoreEvents.Updated);
    }
}

import {Handler, PlainObject, SingleOrPlural} from "@core/types";
import EventBus from "@core/event_bus";
import {setValInPath} from "@lib-utils-kit";

export enum StoreEvents {
    inited = 'inited',
    added = 'added',
    updated = 'updated',
    deleted = 'deleted',
    reinited = 'reinited',
    cleared = 'cleared'
}
export enum StoreSetStateType {
    merge = 'merge',
    replace = 'replace',
}
export default class Store extends EventBus 
{
    protected _state : PlainObject;

    constructor (
        initState : PlainObject,
        protected readonly _NAME : string
    ) {
        super();
        // TODO save sate to localstorage (without personal data?)

        this._init(initState);
        this.emit( StoreEvents.inited );
    }
    init (initState : PlainObject)
    {
        this._init(initState);        
        this.emit( StoreEvents.reinited );
    }
    get state ()
    {
        return this._state;
    }
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
    set (path: string, value: unknown, type : StoreSetStateType = StoreSetStateType.merge)
    {
        console.log('store set', path, value);

        if (!path)
        {
            return;
        }
        const pathArr = path.split('.');

        if (StoreSetStateType.replace == type)
        {
            const partialPathArr = [...pathArr];
            const lastPathPart = partialPathArr.pop() as string; // partialPathArr become partial here, after pop()

            if (partialPathArr.length)
            {
                const partialPath = partialPathArr.join('.');
                let stateOnPath = this.get(partialPath);

                if (!stateOnPath)
                {
                    // not found value on path, so don't need to replace, use merging
                    setValInPath(this._state, path, value);
                }
                else
                    // found value on path, so replace it 
                    stateOnPath = {
                        lastPathPart: value
                    };
            }
            else
                // single part path, just replace 
                this._state[lastPathPart] = value;
        }
        else
            // merge new value into state
            setValInPath(this._state, path, value);

        this.emit( StoreEvents.updated );

        let partOfPath = '';
        pathArr.forEach(part => 
        {
            partOfPath = !partOfPath ? part : `${partOfPath}.${part}`;

            this.emit( Store.getEventName4path(partOfPath) );
        });        
    }
    clear ()
    {
        this._state = {};
        
        this.emit( StoreEvents.cleared ); 
    }
    on (event : SingleOrPlural< string >, callback : Handler)
    {
        this._processEvent(event).forEach( event => super.on(event, callback) );
        return this;
    }
    off (event : SingleOrPlural< string >, callback : Handler)
    {
        this._processEvent(event).forEach( event => super.off(event, callback) );
        return this;
    }
    emit (event : string) 
    {
        console.log('store emit', event);
        super.emit(event);
    }
    static getEventName4path (path: string, event : StoreEvents = StoreEvents.updated)
    {
        return `${event}:${path}`;
    }
    protected _processEvent (event : SingleOrPlural< string >)
    {
        const events = typeof event == 'string' ? [event] : Array.from(event);

        // every listeners also subscribed on cleared and reinited events cause it affects on all state
        events.push(StoreEvents.reinited);
        events.push(StoreEvents.cleared);

        return events;
    }
    protected _init (initState : PlainObject)
    {
        this._state = initState;
    }
}

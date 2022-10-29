
type Event = 
{
    name: string,
    actions: (()=>{})[]
}


export default abstract class EventEmitter
{
    constructor() {
        this.listeners = {};
    }

    on (event, callback) 
    {
        if (!(event in this.listeners))
        {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    off (event, callback) 
    {
        if (event in this.listeners) 
        {
            this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
        }
    }
    protected emit (event, ...args) 
    {
        if (event in this.listeners) 
        {
            this.listeners[event].forEach(listener => listener(...args));
        }
        else
            throw `Error: Нет события: ${event}`;
    }
}

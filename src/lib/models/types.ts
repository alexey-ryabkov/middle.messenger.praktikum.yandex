export type Image = string;
export type Video = string;
export type Location = string;
export type Label = { title : string, image? : Image };

export type Nullable<T> = T | null;

export type Plural<T> = Array<T> | ArrayLike<T>;
export type SingleOrPlural<T> = T | Plural<T>;



export type EventHandler = (event : Event) => void; 
export type EventLsnr = [string, EventHandler]; // { name : string, handler : EventHandler }

export type Handler = (...args) => void; 
export type CEventLsnr = { event : string, handler : Handler };


export interface CompilableTemplate 
{
    compile (data : any) : string;
    // compile (tpl : string, data : any) : string
}

// type EventBusListeners = (...args: any) => void;

 // @ts-ignore

//  export interface ComponentProps {
//     [key: string]: any;
//     className?: string;
//     children?: {};
//     child?: Child | HTMLElement | string;
//     events?: Record<string, (...args: any) => void>;
// }

// this.node = <HTMLElement>divElement.firstChild; это типа as?

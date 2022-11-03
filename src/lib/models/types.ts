export type Image = string;
export type Video = string;
export type Location = string;
export type Label = { title : string, image? : Image };

export type Nullable<T> = T | null;

export type Plural<T> = Array<T> | ArrayLike<T>;
export type SingleOrPlural<T> = T | Plural<T>;



export type EventHandler = (event : Event) => void; 
export type EventLsnr = [string, EventHandler]; 

export type Handler = (...args: any[]) => void; 
export type CEventLsnr = { event : string, handler : Handler };


export interface CompilableTemplate 
{
    compile (data : any) : string;
}
export interface App
{
    get root () : HTMLElement;
    get container () : AppContainer;
}
export interface AppContainer extends BemEntity
{
    get workarea () : HTMLElement;
    mount () : AppContainer;
}
export type BemModDef = [string, string?];
export type BemBlockDef = [string, BemModDef[]?];
export type BemElemDef = [string, string, BemModDef[]?];
export type BemItemDef = BemBlockDef | BemElemDef;
export interface BemEntity
{
    setBemMods (mods : BemModDef[]) : void;
    setElemBemMods (name : string, mods : BemModDef[]) : void;
    bemMix (itemDef : BemItemDef) : void;
    elemBemMix (name : string, itemDef : BemItemDef) : void;
    bemClear (itemDef : BemItemDef) : void;
    elemBemClear  (name : string, itemDef : BemItemDef) : void;
}

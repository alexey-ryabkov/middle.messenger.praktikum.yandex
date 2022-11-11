export type ResourceImage = string;
export type ResourceVideo = string;
export type ResourceLocation = string;
export type Label = { title : string, image? : ResourceImage };

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
    addBemMods (mods : BemModDef[]) : void;
    delBemMods (mods : BemModDef[]) : void;
    addElemBemMods (name : string, mods : BemModDef[]) : void;
    delElemBemMods (name : string, mods : BemModDef[]) : void;
    bemMix (itemDef : BemItemDef) : void;
    elemBemMix (name : string, itemDef : BemItemDef) : void;
    bemUnmix (itemDef : BemItemDef) : void;
    elemBemUnmix  (name : string, itemDef : BemItemDef) : void;
}

export interface FormField
{ 
    get name () : string,    
    get label () : string,
    value? : string,
    setValidationHandlers (lsnrs : SingleOrPlural< EventLsnr >) : void 
}

export interface Routable
{
    // get pathname () : string;    
    get title () : string;
    isPathnameMatch (pathname : string) : boolean;
    mount () : Routable;
    unmount () : void;
}

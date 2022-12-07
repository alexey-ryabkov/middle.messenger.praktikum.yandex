export type ResourceImage = string;
export type ResourceVideo = string;
export type ResourceLocation = string;
export type Label = { title : string, image? : ResourceImage };

export type Nullable<T> = T | null;
export type PlainObject< T = unknown > = 
{
    [key in string]: T;
};

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
export interface ContainarableApp
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

export interface Field
{
    get name () : string,    
    get label () : string,
    value? : string,
    validators? : FieldValidatorDef[],
} 
export interface FormField extends Field
{ 
    // FIXME rename 
    setValidationHandlers (lsnrs : SingleOrPlural< EventLsnr >) : void 
}
export type FieldValidator = (field : Field, errorStack? : string[], params? : object) => boolean;

export type FieldValidatorDef = [FieldValidator, object?];

export interface Routable
{
    get title () : string;
    isPathnameMatch (pathname : string) : boolean;
    mount () : Routable;
    unmount () : void;
}

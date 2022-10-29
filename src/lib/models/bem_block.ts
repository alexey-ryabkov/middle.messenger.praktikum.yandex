import DomComponent, {CompParams} from './dom_component';
import CssClassName, {CssCls} from '../utils/css_cls_helper';
import {eventHandler} from './types';

// @todo расширить params bem-настройками. параметр block ? 
/*
{
    то что передадим в конструкторе переопределит то что в шаблоне
    modifiers: {
        type: value есд=ли boolean то value true/false (добавить/убрать),
        ...
    },
    element: {
        elementName: {
            modifiers: {
                type: value
                ...
            },
        }
    },
    mix ?:
    {
        block mixins ...
        elements {
            elementName:{
                block: {
                    ...
                }
            }
            
        }
        
        
        mixin
        ...
    },
    cls (не-бэм)
}

также нужно подумать как шаблон будет поддерживать

также подумать как миксины создавать
*/



// @todo думаю кортежи логичнее, т.к. структура блок-элемент итак понятна всем..


type BemMod = [string, string?];
type BemItemDef = [string, string?, BemMod[]?];

// type BemMods = Record< string, string | boolean >;
// type BemItemDef = {
//     block : string,
//     elem? : string,
//     mods? : BemMods
// };

// type BemElem = { 
//     element: HTMLElement, 
//     bem: BemItemDef, // @todo делает обязательным elem 
//     events: {} // тут тип DomElementEvents
// };

// @todo события 
export type BemProps = {
    mods? : {
        block? : BemMod[], // @todo массив массивов опять. здесь мб проблема...
        elems? : Record< string, BemMod[] >
    },
    mix? : {
        block? : BemItemDef[],
        elems? : Record< string, BemItemDef[] >
    },
    cls? : {
        block? : CssCls,
        elems? : Record< string, CssCls >
    }
};
type BemParams = CompParams & { bem? : BemProps };

export default abstract class BemBlock extends DomComponent
{
    static readonly ELEMENT_SEPARATOR = '__';
    static readonly MODIFIER_SEPARATOR = '--';
    static readonly MODIFIER_VAL_SEPARATOR = '_';

    protected _elems : HTMLElement[]; // Record< string, { element: HTMLElement, bem: BemItemDef, events: {} } > ?

    constructor (def : BemBlockDef, params : BemParams = {})
    {
        super(params);

        // this._element.querySelector(`.${name}${BemBlock.ELEMENT_SEPARATOR}*`); // @todo назодим все элементы
        // _element вероятно стоит переименовть
    }
    getElem (elem)
    {
        return this._elems;
    }

    protected _processElem (element)
    {
        // делаем структуру Elem
    }

    // 

    // setBlock ()
    // {
    //     // @todo тут апи className
    // }
    // setElemMods (element : string, modifier : string, value : string)
    // {
    //     // @todo тут апи className
    // }

    // прокси записей в элементы
}


 // @todo см также по прочим типам. у Iterable не будет item[0] any - кроме массивов. т.к. массиво массиво будет проблема


// type EventListener = [string, eventHandler];

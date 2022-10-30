import DomComponent, {CompParams, HTMLElementExt, makeHTMLElementExt} from './dom_component';
import {CssCls} from '../utils/css_cls_helper';
import {SingleOrPlural, EventLsnr} from './types';

export type BemModDef = [string, string?];
export type BemBlockDef = [string, BemModDef[]?];
export type BemElemDef = [string, string, BemModDef[]?];
export type BemItemDef = BemBlockDef | BemElemDef;

export function isItemElem (item : BemItemDef) : item is BemElemDef
{
    return 'string' == item[1];
}
export type BemParams = {
    name : string, 
    mods? : {
        block? : BemModDef[],
        elems? : Record< string, BemModDef[] >
    },
    mix? : {
        block? : BemBlockDef[],
        elems? : Record< string, BemElemDef[] >
    },
    events? : {
        block? : SingleOrPlural< EventLsnr >,
        elems? : Record< string, SingleOrPlural< EventLsnr >>
    }
    cssCls? : {
        block? : CssCls,
        elems? : Record< string, CssCls >
    }
};
export type BemCompParams = CompParams & { bem : BemParams };

export default abstract class BemBlock extends DomComponent
{
    static readonly ELEMENT_SEPARATOR = '__';
    static readonly MODIFIER_SEPARATOR = '--';
    static readonly MODIFIER_VAL_SEPARATOR = '_';

    protected _name : string;
    protected _elems : Record< string, HTMLElementExt > = {}; // Record< string, { element: HTMLElement, bem: BemItemDef, events: {} } > ?

    constructor (params : BemCompParams)
    {
        const {bem} = params;

        delete params.bem;        
        super(params);

        this._meta.bem = bem;
        this._name = this._meta.bem.name;

        // @todo это нужно перенести в init ?
        
    }
    get name ()
    {
        return this._name;
    }
    get block () // semantic alias
    {
        return this._element;
    }
    get elems ()
    {
        return this._elems; // @todo мб миксить в HTMLElementExt чтобы элемент отдавал свои бем-сущности?
    }

    setMods (mods : BemModDef[])
    {
        const cls = BemBlock.getModsCls(this._name, mods);
        this.block.addCssCls(cls);
    }
    setElemMods (name : string, mods : BemModDef[])
    {
        if (name in this.elems)
        {
            const cls = BemBlock.getModsCls(BemBlock.getItemElemCls(this._name, name), mods);
            this.elems[name].addCssCls(cls);
        }
    }
    mix (itemDef : BemItemDef) : BemBlock
    {
        const cls = isItemElem(itemDef)
                ? BemBlock.getElemCls(itemDef)
                : BemBlock.getBlockCls(itemDef);

        this.block.addCssCls(cls);
        return this;
    }
    mixElem (name : string, itemDef : BemItemDef) : BemBlock
    {
        if (name in this.elems)
        {
            const cls = isItemElem(itemDef)
                ? BemBlock.getElemCls(itemDef)
                : BemBlock.getBlockCls(itemDef);

            this.elems[name].addCssCls(cls);
        }
        return this;
    }

    protected _initElement () 
    {
        super._initElement();
        
        this.block.querySelectorAll(`[class*='${this._name}${BemBlock.ELEMENT_SEPARATOR}']`).forEach(element => 
        {
            // @todo мб настраивать способ биндинга или привязывать через атрибуты bem-block="" bem-element=""
            const elem : HTMLElementExt = makeHTMLElementExt(element);

            elem.getCssClsArr().forEach(cls => 
            {               
                const clsMatch = cls.match(new RegExp(`^${this._name}${BemBlock.ELEMENT_SEPARATOR}(\w+)$`));
                if (clsMatch)
                {
                    const name = clsMatch[1];
                    this._elems[name] = elem;
                }
            });
        });
    }
    protected _processCssCls ()
    {
        const {mods, mix, cssCls} = this._meta.bem;

        if (cssCls)
        {
            if (cssCls.block) // bem's block css classes override component's css classes
            {
                this.block.addCssCls(cssCls.block);
            }
            else
                super._processCssCls();

            if (cssCls.elems)
            {
                Object.entries(cssCls.elems as Record< string, CssCls >).forEach(([name, cls]) => 
                {
                    if (name in this.elems)
                    {
                        this.elems[name].addCssCls(cls);
                    }
                });
            }
        }
        if (mods)
        {
            if (mods.block)
            {
                this.setMods(mods.block);
            }            
            if (mods.elems)
            {
                Object.entries(mods.elems as Record< string, BemModDef[] >).forEach(([name, mods]) => 
                {
                    if (name in this.elems)
                    {
                        this.setElemMods(name, mods);
                    }
                });
            }
        }
        if (mix)
        {
            if (mix.block)
            {
                (mix.block as BemElemDef[]).forEach(item => this.mix(item));
            }            
            if (mix.elems)
            {
                Object.entries(mix.elems as Record< string, BemElemDef[] >).forEach(([name, items]) => 
                {
                    if (name in this.elems)
                    {
                        items.forEach(item => this.mixElem(name, item));
                    }
                });
            }
        }
    }
    protected _processDomEvents ()
    {
        const {events} = this._meta.bem;

        if (events)
        {
            if (events.block) // bem's block events override component's events
            {
                this.block.addEvntLsnrs(events.block);
            }
            else
                super._processDomEvents();

            if (events.elems)
            {
                Object.entries(events.elems as Record< string, SingleOrPlural< EventLsnr >>).forEach(([name, lsnrs]) => 
                {
                    if (name in this.elems)
                    {
                        this.elems[name].addEvntLsnrs(lsnrs);
                    }
                });
            }
        }
    }

    static getBlockCls (clsDef : BemBlockDef) : string[]
    {
        const blockCls = clsDef[0];
        const cls = [blockCls];

        if (clsDef[1])
        {
            cls.concat(BemBlock.getModsCls(blockCls, clsDef[1]));
        }
        return cls;
    }
    static getElemCls (clsDef : BemElemDef) : string[]
    {
        const elemCls = BemBlock.getItemElemCls(clsDef[0], clsDef[1]);
        const cls = [elemCls];

        if (clsDef[2])
        {
            cls.concat(BemBlock.getModsCls(elemCls, clsDef[2]));
        }
        return cls;
    }    
    static getModsCls (itemCls : string, clsDef : BemModDef[]) : string[]
    {
        const cls = [];

        clsDef.forEach(modClsDef => cls.push(BemBlock.getItemModCls(itemCls, modClsDef)));        
        return cls;
    }
    static getItemElemCls (blockName : string, name : string) : string
    {
        return `${blockName}${BemBlock.ELEMENT_SEPARATOR}${name}`;
    }
    static getItemModCls (itemCls : string, clsDef : BemModDef) : string
    {
        return clsDef[1] 
                ? `${itemCls}${BemBlock.MODIFIER_SEPARATOR}${clsDef[0]}${BemBlock.MODIFIER_VAL_SEPARATOR}${clsDef[1]}`
                : `${itemCls}${BemBlock.MODIFIER_SEPARATOR}${clsDef[0]}`;
    }
    // static parseCls (cls : CssCls) : BemItemDef
    // {        
    // }
}

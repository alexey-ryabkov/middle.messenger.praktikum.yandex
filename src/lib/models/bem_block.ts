import DomComponent, {CompParams, HTMLElementExt, makeHTMLElementExt} from '@models/dom_component';
import {CssCls} from '@lib-utils/css_cls_helper';
import {SingleOrPlural, EventLsnr} from '@models/types';

export type BemModDef = [string, string?];
export type BemBlockDef = [string, BemModDef[]?];
export type BemElemDef = [string, string, BemModDef[]?];
export type BemItemDef = BemBlockDef | BemElemDef;

export function isItemElem (item : BemItemDef) : item is BemElemDef
{
    return typeof item[1] == 'string';
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
    static readonly ELEM_NAME_ATTR = 'bem-element';
    static readonly ELEMENT_SEPARATOR = '__';
    static readonly MODIFIER_SEPARATOR = '--';
    static readonly MODIFIER_VAL_SEPARATOR = '_';

    protected _name : string;
    protected _elems : Record< string, HTMLElementExt > = {}; // Record< string, { element: HTMLElement, bem: BemItemDef, events: {} } > ?

    constructor (params : BemCompParams)
    {   
        super(params);
    }
    get name ()
    {
        return this._name;
    }
    get block () // semantic alias
    {
        return this.element;
    }
    get elems ()
    {
        return this._elems; 
        // TODO мб миксить в HTMLElementExt чтобы элемент отдавал свои бем-сущности?
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

    protected _processParams (params : BemCompParams)
    {
        super._processParams(params);
        this._elems = {};
        this._name = this._meta.bem.name;
    }
    protected _params4meta (params : BemCompParams) 
    {
        return {bem: params.bem, ...super._params4meta(params)}; 
    }
    protected _processCssCls ()
    {
        const {name, mods, mix, cssCls} = this._meta.bem;

        console.log(this.block, this._element);

        this.block.addCssCls(name);

        if (cssCls?.block) // bem's block css classes override component's css classes
        {
            this.block.addCssCls(cssCls.block);
        }
        else
            super._processCssCls();

        if (mods?.block)
        {
            this.setMods(mods.block);
        } 
        if (mix?.block)
        {
            (mix.block as BemElemDef[]).forEach( item => this.mix(item) );
        }
    } 
    protected _processDomEvents ()
    {
        const {events} = this._meta.bem;

        if (events?.block) // bem's block events override component's events
        {
            this.block.addEvntLsnrs(events.block);
        }
        else
            super._processDomEvents();
    }
    protected _processElems ()
    {
        // will check element binding in both ways: by css-class and by bem-element attribute. each of binding type can be handy in different situations
        this.block.querySelectorAll(`[class*='${this._name}${BemBlock.ELEMENT_SEPARATOR}']`).forEach(element => 
        {
            const elem : HTMLElementExt = makeHTMLElementExt(element);

            elem.getCssClsArr().forEach(cls => 
            {               
                const clsMatch = cls.match(new RegExp(`^${this._name}${BemBlock.ELEMENT_SEPARATOR}(\\w+)$`));

                if (clsMatch)
                {
                    const elemName = clsMatch[1];
                    this._elems[elemName] = elem;
                }
            });
        });
        // this.block.querySelectorAll(`[${BemBlock.ELEM_NAME_ATTR}]`).forEach(element => 
        // {
        //     const elemName = element.getAttribute(BemBlock.ELEM_NAME_ATTR);            

        //     if (!this._elems[elemName])
        //     {
        //         const elem : HTMLElementExt = makeHTMLElementExt(element);

        //         elem.addCssCls( BemBlock.getElemCls( [this._name, elemName] ));                

        //         this._elems[elemName] = elem;
        //     }
        // });

    }
    protected _processElemCssCls ()
    {
        const {mods, mix, cssCls} = this._meta.bem;

        if (cssCls?.elems)
        {
            Object.entries(cssCls.elems as Record< string, CssCls >).forEach(([name, cls]) => 
            {
                if (name in this.elems)
                {
                    this.elems[name].addCssCls(cls);
                }
            });
        }        
        if (mods?.elems)
        {
            Object.entries(mods.elems as Record< string, BemModDef[] >).forEach(([name, mods]) => 
            {
                if (name in this.elems)
                {
                    this.setElemMods(name, mods);
                }
            });
        }      
        if (mix?.elems)
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
    protected _processElemsDomEvents ()
    {
        const {events} = this._meta.bem;

        if (events?.elems)
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
    protected _render() 
    {
        super._render();
        
        this._processElems();
        this._processElemCssCls();
        this._processElemsDomEvents();
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

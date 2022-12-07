import Block, {BlockAttrs, BlockParams, HTMLElementExt, makeHTMLElementExt} from '@core/block';
import {CssCls} from '@lib-utils/css_cls_helper';
import {SingleOrPlural, EventLsnr, BemModDef, BemBlockDef, BemElemDef, BemItemDef, BemEntity} from '@core/types';

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
        block? : BemItemDef[],
        elems? : Record< string, BemItemDef[] >
    },    
    cssCls? : {
        block? : CssCls,
        elems? : Record< string, CssCls >
    },
    attrs? : {
        block? : BlockAttrs,
        elems? : Record< string, BlockAttrs >
    },
    events? : {
        block? : SingleOrPlural< EventLsnr >,
        elems? : Record< string, SingleOrPlural< EventLsnr >>
    } 
};
export type BemCompParams = BlockParams & { bem : BemParams };

export default abstract class BemBlock extends Block implements BemEntity
{
    static readonly ELEM_NAME_ATTR = 'bem-element';
    static readonly ELEMENT_SEPARATOR = '__';
    static readonly MODIFIER_SEPARATOR = '--';
    static readonly MODIFIER_VAL_SEPARATOR = '_';

    protected _name : string;
    protected _elems : Record< string, HTMLElementExt > = {};

    constructor (params : BemCompParams)
    {   
        super(params);
    }
    get bemName ()
    {
        return this._name;
    }
    get elems ()
    {
        return this._elems; 
    }
     
    addBemMods (mods : BemModDef[])
    {
        const cls = BemBlock.getModsCls(this._name, mods);
        this.element.addCssCls(cls);
    }
    delBemMods (mods : BemModDef[])
    {
        const cls = BemBlock.getModsCls(this._name, mods);
        this.element.delCssCls(cls);
    }
    addElemBemMods (name : string, mods : BemModDef[])
    {
        if (name in this.elems)
        {
            const cls = BemBlock.getModsCls(BemBlock.getItemElemCls(this._name, name), mods);
            this.elems[name].addCssCls(cls);
        }
    }
    delElemBemMods (name : string, mods : BemModDef[])
    {
        if (name in this.elems)
        {
            const cls = BemBlock.getModsCls(BemBlock.getItemElemCls(this._name, name), mods);
            this.elems[name].delCssCls(cls);
        }
    }
    bemMix (itemDef : BemItemDef)
    {
        this.element.addCssCls( BemBlock.getMixCls(itemDef) );
    }
    elemBemMix (name : string, itemDef : BemItemDef)
    {
        if (name in this.elems)
        {
            this.elems[name].addCssCls( BemBlock.getMixCls(itemDef) );
        }
    }
    bemUnmix (itemDef : BemItemDef)
    {
        this.element.getCssClsArr().forEach(cls => 
        {
            if (cls.startsWith(itemDef[0]))
            {
                this.element.delCssCls(cls);
            }
        });
    }
    elemBemUnmix (name : string, itemDef : BemItemDef)
    {
        if (name in this.elems)
        {
            this.elems[name].getCssClsArr().forEach(cls => 
            {
                if (cls.startsWith(itemDef[0]))
                {
                    this.element.delCssCls(cls);
                }
            });
        }
    }

    protected _processParams (params : BemCompParams)
    {
        super._processParams(params);
        this._elems = {};
        this._name = this._meta.bem.name;
    }
    protected _params4meta (params : BemCompParams) 
    {
        return { bem: params.bem, ...super._params4meta(params) }; 
    }
    protected _processCssCls ()
    {
        const {name, mods, mix, cssCls} = this._meta.bem;

        this.element.addCssCls(name);

        if (cssCls?.block) // bem's block css classes override component's css classes
        {
            this.element.addCssCls(cssCls.block);
        }
        else
            super._processCssCls();

        if (mods?.block)
        {
            this.addBemMods(mods.block);
        } 
        if (mix?.block)
        {
            (mix.block as BemElemDef[]).forEach( item => this.bemMix(item) );
        }
    } 
    protected _processAttrs ()
    {
        const {attrs} = this._meta; 

        if (attrs?.block) // bem's block attrs override component's attrs
        {
            this.setAttrs(attrs.block);
        }
        else
            super._processAttrs();
    }
    protected _processDomEvents ()
    {
        const {events} = this._meta.bem;

        if (events?.block) // bem's block events override component's events
        {
            this.element.addEventExtListeners(events.block);
        }
        else
            super._processDomEvents();
    }
    processElems () 
    {
        this._elems = {};
        this.element.querySelectorAll(`[class*='${this._name}${BemBlock.ELEMENT_SEPARATOR}']`).forEach(element => 
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
                    this.addElemBemMods(name, mods);
                }
            });
        }      
        if (mix?.elems)
        {
            Object.entries(mix.elems as Record< string, BemElemDef[] >).forEach(([name, items]) => 
            {
                if (name in this.elems)
                {
                    items.forEach(item => this.elemBemMix(name, item));
                }
            });
        }
    }
    protected _processElemAttrs ()
    {
        const {attrs} = this._meta.bem;
       
        if (attrs?.elems)
        {
            Object.entries(attrs.elems as Record< string, BlockAttrs >).forEach(([name, elemAttrs]) => 
            {
                if (name in this.elems)
                {
                    Object.entries(elemAttrs).forEach(([attrName, attrValue]) => 
                    {
                        this.elems[name].setAttribute(attrName, String(attrValue));
                    });
                    
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
                    this.elems[name].addEventExtListeners(lsnrs);
                }
            });
        }
    }    
    protected _render() 
    {
        super._render();
        
        this.processElems();
        this._processElemCssCls();
        this._processElemAttrs();
        this._processElemsDomEvents();
    }

    static getMixCls (itemDef : BemItemDef) : string[]
    {
        return isItemElem(itemDef)
                    ? BemBlock.getElemCls(itemDef)
                    : BemBlock.getBlockCls(itemDef);
    }
    static getBlockCls (clsDef : BemBlockDef) : string[]
    {
        const blockCls = clsDef[0];
        let cls : string[] = [blockCls];

        if (clsDef[1])
        {
            cls = cls.concat(BemBlock.getModsCls(blockCls, clsDef[1]));
        }
        return cls;
    }
    static getElemCls (clsDef : BemElemDef) : string[]
    {
        const elemCls = BemBlock.getItemElemCls(clsDef[0], clsDef[1]);
        let cls : string[] = [elemCls];

        if (clsDef[2])
        {
            cls = cls.concat(BemBlock.getModsCls(elemCls, clsDef[2]));
        }
        return cls;
    }    
    static getModsCls (itemCls : string, clsDef : BemModDef[]) : string[]
    {
        const cls : string[] = [];

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
}

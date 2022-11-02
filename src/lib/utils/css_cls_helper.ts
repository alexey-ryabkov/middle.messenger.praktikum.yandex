import {unique} from '.';
import {SingleOrPlural} from '@models/types';

export type CssCls = SingleOrPlural<string>;
export function cssCls2str (cls : CssCls) : string
{
    return cssCls2arr(cls).join(' ');
}
export function cssCls2arr (cls : CssCls) : string[] 
{
    if (typeof cls == 'string')
    {
        cls = cls.split(/\s+/).filter(Boolean);
    }
    return unique(Array.from(cls));
}

export interface HTMLElementCssCls 
{
    getCssClsArr : () => string[],
    changeCssCls : (fresh : CssCls, obsolete? : CssCls) => void,
    addCssCls : (cls : CssCls) => void,
    delCssCls : (cls : CssCls) => void,
    clearCssCls : () => void
}
const CssClsHelperMixin = 
{
    getCssClsArr () : string[] 
    {
        return Array.from(this.classList);
    },
    changeCssCls (fresh : CssCls, obsolete? : CssCls) 
    {
        if (obsolete)
        {
            this.delCssCls(obsolete);
            this.addCssCls(fresh);            
        }
        else
            this.className = cssCls2str(fresh);
    },
    addCssCls (cls : CssCls)
    {
        cssCls2arr(cls).forEach(val => this.classList.add(val));
    },
    delCssCls (cls : CssCls)
    {
        cssCls2arr(cls).forEach(val => this.classList.remove(val));
    },
    clearCssCls ()
    {
        this.className = '';
    }
};
export default CssClsHelperMixin;

// class CssClassName 
// {
//     constructor (
//         protected readonly _element : Element,
//         cls : CssCls = [],
//     ) {
//         this._element.className = CssClassName._proc2str(cls);
//     }
//     get values ()
//     {
//         return this._element.className;
//     }
//     get list ()
//     {
//         return this._element.classList;
//     }
//     get array ()
//     {
//         return Array.from(this.list);
//     }    
//     replace (fresh : CssCls, obsolete? : CssCls) 
//     {
//         if (obsolete)
//         {
//             this.remove(obsolete);
//             this.add(fresh);            
//         }
//         else
//             this._element.className = CssClassName._proc2str(fresh);
//     }
//     add (cls : CssCls)
//     {
//         CssClassName.proc2arr(cls).forEach(val => this._element.classList.add(val));
//     }
//     remove (cls : CssCls)
//     {
//         CssClassName.proc2arr(cls).forEach(val => this._element.classList.remove(val));
//     }
//     clear ()
//     {
//         this._element.className = '';
//     }
//     protected static _proc2str (cls : CssCls) : string
//     {
//         return CssClassName.proc2arr(cls).join(' ');
//     }
//     static proc2arr (cls : CssCls) : string[]
//     {
//         if (!Array.isArray(cls))
//         {
//             cls = cls.split(/\s+/).filter(Boolean);
//         }
//         return unique(cls);
//     }
// }

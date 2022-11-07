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

import {Routable} from '@core/types';
import Layout from '@core/layout';

export default abstract class Page implements Routable 
{   
    constructor (
        protected _name : string, 
        protected _title : string = '',
        protected _blockName : string = '') 
    {
        if (!this._blockName)
        {
            this._blockName = `_page${ this._name[0].toUpperCase() + this._name.slice(1) }`;
        }
    }
    get name ()
    {
        return this._name;
    }
    get title ()
    {
        return this._title;
    }
    get url ()
    {
        return Page.url(this._name);
    }
    isPathnameMatch (pathname : string)
    {
        return pathname == this.url;
    }
    mount ()
    {
        this._layout.mount();
        this._processPageLayout();
        return this;
    }
    unmount ()
    {
        this._layout.unmount();
        this._layout.bemUnmix([this._blockName]); 
    }
    protected abstract get _layout () : Layout; 

    protected _processPageLayout ()
    {
        this._layout.bemMix([this._blockName]);
    } 
    static url = (pageName : string) => `/${pageName}`;      
}

import Layout from '@models/layout';

export default abstract class Page 
{   
    constructor (
        protected _name : string, 
        protected _title? : string,
        protected _blockName? : string) 
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
        return Page.url(this._name)
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
        this._layout.bemClear([this._blockName]); 
    }
    protected abstract get _layout () : Layout; 

    protected _processPageLayout ()
    {
        this._layout.bemMix([this._blockName]);
    } 
    static nameFromUrl (url : string)
    {
        let pageName = '';
        const pageMatch = url.match(/^.*?page\=(\w+).*?$/i);

        if (pageMatch)
        {
            pageName = pageMatch[1];
        }
        return pageName;
    }
    static url = (pageName : string) => `/?page=${pageName}`;    
}

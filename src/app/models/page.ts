// import Container from '@models/container';
import Layout from '@models/layout';
import SimpleBlock from '@models/simple_block';

export default class Page 
{   
    constructor (
        protected _name : string, 
        protected _layout : Layout, 
        protected _areas : Record< string, SimpleBlock >, 
        protected _bemName? : string, 
        protected _title? : string) 
    {
        if (!this._bemName)
        {
            this._bemName = this._name;
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
        this._layout.mix([this._bemName]);
        this._layout.areas = this._areas;
        return this;
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

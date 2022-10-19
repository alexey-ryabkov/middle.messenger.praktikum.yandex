export default class Page 
{
    _layout = null;
    _areas = {};
    _rootCssClass = '';
    _title = '';
    
    constructor (layout, areas = {}, rootCssClass = '', title = '') 
    {
        this._layout = layout;     
        this._areas = areas;   
        this._rootCssClass = rootCssClass;
        this._title = title;   
    }  
    get rootCssClass ()
    {
        return [this._layout.rootCssClass, this._rootCssClass].join(' ').trim();
    }
    get title ()
    {
        return this._title;
    }
    render ()
    {
        this._layout.areas = this._areas;
        return this._layout.render();
    }
}
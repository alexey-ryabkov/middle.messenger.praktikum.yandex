import Templator from './templator';

export default class Layout 
{
    props = {};
    _template = null;
    _rootCssClass = '';

    constructor (tpl, rootCssClass = '', props = {}) 
    {
        this._template = new Templator(tpl);
        this._rootCssClass = rootCssClass;
        this.props = props;
    }  
    get rootCssClass ()
    {
        return this._rootCssClass;
    }
    set areas (areas) // области макета, например {content: ..., sidebar: ...}
    {
        this.props.areas = areas;
    }
    render ()
    {
        return this._template.compile(this.props);
    }
}

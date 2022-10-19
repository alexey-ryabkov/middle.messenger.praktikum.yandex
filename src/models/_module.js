export default class _Module
{
    props = {};
    _template = null;
    
    constructor (props = {}) 
    {
        this.props = props;
        this._initTemplate();
    }
    _initTemplate () 
    {
        throw new Exception('Trying to call abstract method of _Module class'); 
    }
    set template (template)
    {
        this._template = template;
    }
    render ()
    {
        return this._template.compile(this.props);
    }
    mount (node, mountType = 'append')
    {
        const rendered = this.render();

        if (!(node instanceof Element))
        {
            node = document.querySelector(node);
        }

        if (rendered instanceof Element)
        {
            if (!['append', 'prepend', 'before', 'after', 'replaceWith'].includes(mountType))
            {
                mountType = 'append';
            }
            node[mountType](rendered);
        }
        else
            node.innerHTML = rendered;

        return this;
    }
}
import Templator from '../../models/templator';
import _Module from '../../models/_module';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);
template.regAsTemplatorBlock('button');

export default class Button extends _Module 
{
    constructor (props = {}) 
    {
        props.label = String(props.label) || 'кнопка';

        if (props.isLink && !props.href)
        {
            props.href = '#';
        }

        if (!props.cssClass)
        {
            props.cssClass = '';
        }
        
        if ('importance' in props)
        {
            props.cssClass += ` button--importance_${props.importance}`;
        }
        if ('size' in props)
        {
            props.cssClass += ` button--size_${props.size}`;
        }
        if ('width' in props)
        {
            props.cssClass += ` button--width_${props.width}`;
        }
        super(props);
    }
    _initTemplate () 
    {
        this.template = template;
    }
}

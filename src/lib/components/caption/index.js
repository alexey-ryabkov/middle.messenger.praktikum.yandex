import Templator from '../../models/templator';
import _Module from '../../models/_module';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);
template.regAsTemplatorBlock('caption');

export default class Caption extends _Module 
{
    constructor (props = {}) 
    {
        if (!props.tag)
        {
            props.tag = 'h1';
        }

        props.caption = String(props.caption) || '';
        props.taglineText = String(props.taglineText) || '';
        super(props);
    }
    _initTemplate () 
    {
        this.template = template;
    }
}
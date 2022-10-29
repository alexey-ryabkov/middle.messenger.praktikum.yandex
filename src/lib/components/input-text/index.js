import Templator from '../../models/templator';
import _Module from '../../models/_module';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);
template.regAsTemplatorBlock('input-text');

export default class InputText extends _Module 
{
    constructor (props = {}) 
    {
        props.type = String(props.type) || 'text';
        props.isAutocomplete = !!props.isAutocomplete;

        super(props);
    }
    _initTemplate () 
    {
        this.template = template;
    }
}

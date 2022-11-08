import Templator from '@models/templator';
import {BlockEvents} from '@models/block';
import FormFieldComponent, {FormFieldProps} from '@models/form_field';
import tpl from './tpl.hbs';
import './style.scss';

export type InputTextProps = FormFieldProps & 
{
    type? : 'text' | 'password',
    placeholder? : string,
    autocomplete? : 'on' | 'off'
};

export default class InputText extends FormFieldComponent
{
    constructor (props : InputTextProps, events : BlockEvents = [])
    {
        const {name, type = 'text', placeholder = '', autocomplete = 'off'} = props;
        
        super({ bem: {
            name: 'inputText', 
            attrs: { elems: { 'input': {name, type, placeholder, autocomplete} }}, 
            events: { elems: { 'input': events }} 
        }});

        if (props.value)
        {
            this.value = props.value;
        }
    }
    get value () 
    {
        return this._input.value;
    }
    set value (value : string) 
    {
        this._input.value = value;
    }
    protected get _input ()
    {
        const input = <unknown> this.elems['input'];
        return (input as HTMLInputElement);
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

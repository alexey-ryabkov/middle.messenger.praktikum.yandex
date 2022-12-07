import Templator from '@core/templator';
import {BlockEvents} from '@core/block';
import FormFieldComponent, {FormFieldProps} from '@core/block/form_field';
import tpl from './tpl.hbs';
import './style.scss';
import { BemCompParams, BemParams } from '@core/block/bem';

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
        props.inputEvents = events;
        
        super(props);

        if (props.value)
        {
            this.value = props.value;
        }
    }
    protected _prepareBemParams (params : BemCompParams)
    {
        const props = params.props as InputTextProps & {inputEvents : BlockEvents};

        const {name, type = 'text', placeholder = '', autocomplete = 'off', inputEvents} = props;

        const bem : BemParams = { 
            name: 'inputText',                 
            attrs: {elems: { 'input': {name, type, placeholder, autocomplete} }}, 
            events: {elems: { 'input': inputEvents }} 
        };        
        return bem;
    }
    get value () 
    {
        return this._input.value;
    }
    set value (value : string) 
    {
        this._input.value = value;
    }
    static get validationEvents ()
    {
        return ['focus', 'blur', 'keyup'];
    }
    protected get _input ()
    {
        // FIXME now we have to call it
        this.processElems();

        const input = <unknown> this.elems['input'];
        return (input as HTMLInputElement);
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BlockProps} from '@models/block';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

export type InputTextProps = BlockProps & 
{
    name? : string,
    type? : string,
    plaseholder? : string,
    autocomplete? : boolean,
};
export function buildFormFields (fields : Record< string, string >) 
{
    return Object.fromEntries(Object.entries(fields).map( ([label, name]) => [ label, new InputText({name}) ] )); 
}
export default class InputText extends ComponentBlock 
{
    constructor (props : InputTextProps)
    {
        if (!props.type)
        {
            props.type = 'text';
        }
        super({ attrs: props, bem: {name: 'inputText'} });
    }
    protected get _template () 
    {
        return template;
    }
}

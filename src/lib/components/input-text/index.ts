import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BlockProps, BlockEvents} from '@models/block';
import tpl from './tpl.hbs';
import './style.scss';

export type InputTextProps = BlockProps & 
{
    name? : string,
    type? : string,
    placeholder? : string,
    autocomplete? : boolean,
};
export function buildFormFields (fields : Record< string, string >) 
{
    return Object.fromEntries(Object.entries(fields).map( ([label, name]) => [ label, new InputText({name}) ] )); 
}
export default class InputText extends ComponentBlock 
{
    constructor (props : InputTextProps, events? : BlockEvents)
    {
        const attrs = props;
        if (!attrs.type)
        {
            attrs.type = 'text';
        }
        super({ events, bem: {name: 'inputText', attrs: { elems: { 'input': attrs }}}});
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

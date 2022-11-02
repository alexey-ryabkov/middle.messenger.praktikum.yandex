import Templator from '@models/templator';
import SimpleBlock from '@models/simple_block';
import {CompProps} from '@models/dom_component';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

export type InputTextProps = CompProps & 
{
    name? : string,
    type? : string,
    plaseholder? : string,
    autocomplete? : boolean,
};
export function buildFormFields (fields : Record< string, string >) // : Record< string, string > @todo разобраться с возвращаемым типом 
{
    const fldDef = {
        type: 'text',
        cssClass: 'form__field' // @todo определить через bem , когда переделаю компонент InputText
    };
    return Object.fromEntries(Object.entries(fields).map( ([label, name]) => [ label, new InputText({name, ...fldDef}).render() ] ));
}
export default class InputText extends SimpleBlock 
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

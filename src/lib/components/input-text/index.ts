import Templator from '@models/templator';
import SimpleBlock from '@models/simple_block';
import {CompProps} from '@models/dom_component';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);
template.regAsTemplatorBlock('button');

export type InputTextProps = CompProps & 
{
    name? : string,
    type? : string,
    plaseholder? : string,
    autocomplete? : boolean,
};
export default class InputText extends SimpleBlock 
{
    _template = template;

    constructor (props : InputTextProps)
    {
        if (!props.type)
        {
            props.type = 'text';
        }
        super({ attrs: props, bem: {name: 'inputText'} });
    }
}

import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BlockProps, BlockEvents} from '@models/block';
import {InputTextField} from '@models/types';
import tpl from './tpl.hbs';
import './style.scss';

export type InputTextProps = BlockProps & InputTextField;
export default class InputText extends ComponentBlock 
{
    constructor (props : InputTextProps, events : BlockEvents = [])
    {
        const {name, type = 'text', placeholder = '', autocomplete = 'off'} = props;

        super({ bem: {
            name: 'inputText', 
            attrs: { elems: { 'input': {name, type, placeholder, autocomplete} }}, 
            events: { elems: { 'input': events }} 
        }});
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

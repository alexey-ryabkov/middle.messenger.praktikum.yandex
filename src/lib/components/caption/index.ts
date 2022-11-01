import Templator from '@models/templator';
import SimpleBlock from '@models/simple_block';
import {CompProps} from '@models/dom_component';
import tpl from './tpl.hbs';
import './style.scss';

export type CaptionProps = CompProps & 
{
    caption : string,
    tagline? : string,
};
export default class Caption extends SimpleBlock 
{
    _template = new Templator(tpl);

    constructor (props : CaptionProps)
    {
        if (!props.node)
        {
            props.node = 'h1';
        }
        super({ props, bem: {name: 'caption'} });
    }
} 

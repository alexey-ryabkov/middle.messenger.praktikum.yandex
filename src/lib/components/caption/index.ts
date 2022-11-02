import Templator from '@models/templator';
import SimpleBlock from '@models/simple_block';
import {CompProps} from '@models/dom_component';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

export type CaptionProps = CompProps & 
{
    caption : string,
    captionTag? : string,
    tagline? : string,
};
export default class Caption extends SimpleBlock 
{
    constructor (props : CaptionProps)
    {
        // const {node = 'h1'} = props;

        if (!props.captionTag)
        {
            props.captionTag = 'h1';
        }
        super({ props, bem: {name: 'caption'} });
    }
    protected get _template () 
    {
        return template;
    }
} 

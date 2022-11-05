import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BlockProps} from '@models/block';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

export enum CaptionSize {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6',
}
export type CaptionProps = BlockProps & 
{
    caption : string,
    tagline? : string,
    size? : CaptionSize
};
export default class Caption extends ComponentBlock 
{
    constructor (props : CaptionProps)
    {
        props.captionTag = props.size ? props.size : CaptionSize.h1;

        super({ props, bem: {name: 'caption'} });
    }
    protected get _template () 
    {
        return template;
    }
} 

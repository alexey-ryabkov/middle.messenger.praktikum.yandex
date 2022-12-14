import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import { BemCompParams, BemParams } from '@core/block/bem';
import {BlockProps} from '@core/block';
import tpl from './tpl.hbs';
import './style.scss';

export enum CaptionSize {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6',
}
export enum CaptionWeight {
    Thin = 'Thin',
    Light = 'Light',
    Regular = 'Regular',
    Medium = 'Medium',
    Semibold = 'Semibold',
    Bold = 'Bold',
}
export type CaptionProps = BlockProps & 
{
    caption : string,
    tagline? : string,
    size? : CaptionSize,
    weight? : CaptionWeight
};
export default class Caption extends ComponentBlock 
{
    constructor (props : CaptionProps)
    { 
        props.captionTag = CaptionSize.h1;

        if ('size' in props)
        {
            props.captionTag = props.size;
        }
        super(props);
    }
    protected _prepareBemParams (params : BemCompParams)
    {
        const props = params.props as CaptionProps;
        const bem : BemParams = { 
            name: 'caption', 
            mods: { elems: { 'headline': [] }}
        };
        if ('size' in props)
        {
            if (bem?.mods?.elems)
            {
                bem.mods.elems['headline'].push([ 'size', props.size ]);
            }
        }
        if ('weight' in props && bem?.mods?.elems)
        {
            bem.mods.elems['headline'].push([ 'weight', props.weight ]);            
        }
        return bem;
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
} 

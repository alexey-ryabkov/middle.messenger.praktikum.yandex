import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BemCompParams, BemParams} from '@core/block/bem';
import {BlockProps, BlockEvents} from '@core/block';
import tpl from './tpl.hbs';
import './style.scss';

export type ButtonProps = BlockProps & 
{
    label : string,
    isLink? : boolean,
    href? : string,
    name? : string,
    importance? : 'primary' | 'secondary',
    size? : 'big',
    width? : 'full',
};
export default class Button extends ComponentBlock 
{
    constructor (props : ButtonProps, events? : BlockEvents)
    {
        const attrs : { href? : string, name? : string} = {};        
        let node = 'button';

        if (props.isLink)
        {
            node = 'a';
            attrs.href = props.href ? props.href : '#';
        }
        else if (props.name)
        {
            attrs.name = props.name;
        }    
        super(props, events, {node, attrs});
    }
    protected _prepareBemParams (params : BemCompParams)
    {
        const props = params.props as ButtonProps;
        const bem : BemParams = { 
            name: 'button', 
            mods: {block: []} 
        };
        ['importance', 'size', 'width'].forEach(mod => 
        {
            if (mod in props && bem?.mods?.block)
            {
                bem.mods.block.push([ mod, props[mod] ]);
            }
        });   
        return bem;
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

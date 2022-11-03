import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import './style.scss';
import {BemParams} from '@models/bem_block';
import {BlockProps, BlockEvents} from '@models/block';
import tpl from './tpl.hbs';


const template = new Templator(tpl);

export type ButtonProps = BlockProps & //
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
        const bem : BemParams = { name: 'button', mods: {block: []} };

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
        ['importance', 'size', 'width'].forEach(mod => 
        {
            if (mod in props && bem?.mods?.block)
            {
                bem.mods.block.push([ mod, props[mod] ]);
            }
        });        
        super({node, props, attrs, events, bem});
    }
    protected get _template () 
    {
        return template;
    }
}

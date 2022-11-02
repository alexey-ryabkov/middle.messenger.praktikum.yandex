import Templator from '@models/templator';
import SimpleBlock from '@models/simple_block';
import {CompProps, CompEvents} from '@models/dom_component';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

export type ButtonProps = CompProps & //
{
    label : string,
    isLink? : boolean,
    href? : string,
    name? : string,
    importance? : 'primary' | 'secondary',
    size? : 'big',
    width? : 'full',
};
export default class Button extends SimpleBlock 
{
    constructor (props : ButtonProps, events? : CompEvents)
    {
        const attrs : { href? : string, name? : string} = {};
        const bem = { name: 'button', mods: {block: []} };

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
            if (mod in props)
            {
                bem.mods.block.push([ mod, props[mod] ]);
            }
        });        
        super({node, props, attrs, bem});
    }
    protected get _template () 
    {
        return template;
    }
}

import Templator from '@models/templator';
import SimpleBlock from '@models/simple_block';
import {CompProps} from '@models/dom_component';
import tpl from './tpl.hbs';
import './style.scss';

export type ButtonProps = CompProps & 
{
    label : string,
    isLink? : boolean,
    href? : string,
    name? : string,
    tagline? : string,
    importance? : 'primary' | 'secondary',
    size? : 'big',
    width? : 'full',
};
export default class Button extends SimpleBlock 
{
    _template = new Templator(tpl);

    constructor (props : ButtonProps)
    {
        const attrs : { href? : string, name? : string} = {};
        const bem = { name: 'button', mods: {block: []} };

        props.node = 'button';

        if (props.isLink)
        {
            props.node = 'a';
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
        super({props, attrs, bem});
    }
}

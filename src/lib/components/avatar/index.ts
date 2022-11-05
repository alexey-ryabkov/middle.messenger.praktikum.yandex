import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import './style.scss';
import {BemParams} from '@models/bem_block';
import {BlockProps} from '@models/block';
import tpl from './tpl.hbs';


const template = new Templator(tpl);

export type AvatarProps = BlockProps & 
{
    image : string,
    size? : 'small' | 'regular'
};
export default class Avatar extends ComponentBlock 
{
    constructor (props : AvatarProps)
    {
        const bem : BemParams = { name: 'avatar', mods: {block: []} };

        props.image = `../../../../static/images/${props.image}`;

        if ('size' in props && bem?.mods?.block)
        {
            bem.mods.block.push([ 'size', props.size ]);
        }
        super({ props, bem });
    }
    protected get _template () 
    {
        return template;
    }
}

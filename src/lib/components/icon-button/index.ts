import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BemParams} from '@models/bem_block';
import {BlockProps, BlockEvents} from '@models/block';
import Icon from '@lib-components/icon';
import tpl from './tpl.hbs';
import './style.scss';

export type IconButtonProps = BlockProps & 
{
    icon : Icon,
    label? : string,
    importance? : 'primary' | 'secondary',
    size? : 'small' | 'regular' | 'large'
};
export default class IconButton extends ComponentBlock 
{
    constructor (props : IconButtonProps, events? : BlockEvents)
    {
        const bem : BemParams = { name: 'iconButton', mods: {block: []} };

        if ('size' in props && bem?.mods?.block)
        {
            bem.mods.block.push([ 'size', props.size ]);
        }
        if ('importance' in props && bem?.mods?.block)
        {
            bem.mods.block.push([ 'importance', props.importance ]);
        }

        props.icon.bemMix(['iconButton', 'icon']);

        super({ props, events, bem });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BemCompParams, BemParams} from '@core/block/bem';
import {BlockProps, BlockEvents} from '@core/block';
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
        props.icon.bemMix(['iconButton', 'icon']);

        super(props, events, {node: 'button'});
    }
    protected _prepareBemParams (params : BemCompParams)
    {
        const props = params.props as IconButtonProps;
        const bem : BemParams = { 
            name: 'iconButton',
            mods: {block: []} 
        };
        if ('size' in props && bem?.mods?.block)
        {
            bem.mods.block.push([ 'size', props.size ]);
        }
        if ('importance' in props && bem?.mods?.block)
        {
            bem.mods.block.push([ 'importance', props.importance ]);
        } 
        return bem;
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

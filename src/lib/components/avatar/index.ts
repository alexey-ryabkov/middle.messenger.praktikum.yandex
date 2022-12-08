import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BemCompParams, BemParams} from '@core/block/bem';
import {BlockProps} from '@core/block';
import tpl from './tpl.hbs';
import './style.scss';

export type AvatarProps = BlockProps & 
{
    image? : string,
    size? : 'small' | 'regular' | 'large',
    alt? : string,
};
export default class Avatar extends ComponentBlock 
{
    constructor (props : AvatarProps)
    {
        if (!props.image)
        {
            const stubImg = new URL(
                '../../../../static/images/avatar.jpg',
                import.meta.url
            );
            props.image = stubImg.pathname; 
        }
        super(props);
    }
    protected _prepareBemParams (params : BemCompParams)
    {
        const props = params.props as AvatarProps;
        const bem : BemParams = { 
            name: 'avatar', 
            mods: {block: []} 
        };
        if ('size' in props && bem?.mods?.block)
        {
            bem.mods.block.push([ 'size', props.size ]);
        }
        return bem;
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

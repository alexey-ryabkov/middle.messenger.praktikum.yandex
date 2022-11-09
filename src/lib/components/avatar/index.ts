import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BemParams} from '@models/bem_block';
import {BlockProps} from '@models/block';
import tpl from './tpl.hbs';
import './style.scss';

export type AvatarProps = BlockProps & 
{
    image? : string,
    size? : 'small' | 'regular' | 'large'
};
export default class Avatar extends ComponentBlock 
{
    constructor (props : AvatarProps)
    {
        const bem : BemParams = { name: 'avatar', mods: {block: []} };

        if (!props.image)
        {
            const stubImg = new URL(
                '../../../../static/images/avatar.jpg',
                import.meta.url
            );
            props.image = stubImg.pathname;
        }
        if ('size' in props && bem?.mods?.block)
        {
            bem.mods.block.push([ 'size', props.size ]);
        }
        super({ props, bem });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BemParams} from '@models/bem_block';
import {BlockProps} from '@models/block';
import tpl from './tpl.hbs';
import './style.scss';

export enum IconVar {
    plus = 'plus',
    search = 'search',
    images = 'images',
    user = 'user',
    location = 'location',
    circle_info = 'circle_info',
    camera = 'camera',
    plane = 'plane',
    gear = 'gear',
    file_ = 'file_',
    trash = 'trash',
    flag = 'flag',
    cross = 'cross',
    circle_question = 'circle_question',
    checkmark = 'checkmark',
    circle_dots = 'circle_dots',
    paperclip = 'paperclip',
    circle_cross = 'circle_cross'
}
const iconSizes : Record< string, [number, number] > = {
    plus: [14, 15],
    search: [17, 16],
    images: [22, 18],
    user: [18, 18],
    location: [16, 20],
    circle_info: [18, 18],
    camera: [21, 14],
    plane: [19, 19],
    gear: [18, 18],
    file_: [14, 18],
    trash: [17, 19],
    flag: [15, 18],
    cross: [14, 18],
    circle_question: [18, 18],
    checkmark: [18, 18],
    circle_dots: [18, 18],
    paperclip: [18, 20],
    circle_cross: [18, 18],
}
export type IconProps = BlockProps & 
{
    variant : IconVar,
    size? : 'small' | 'regular' | 'large'
};
export default class Icon extends ComponentBlock 
{
    constructor (props : IconProps)
    {
        const node = 'span';
        const bem : BemParams = { 
            name: 'icon', 
            mods: { elems: { 'icnImg': [] }},
            attrs: { elems: { 'icnImg': {} }}
        };
        const variant = props.variant;

        ['width', 'height'].forEach((prop, i) => 
        {
            if (bem?.attrs?.elems)
            {
                bem.attrs.elems['icnImg'][prop] = `${iconSizes[variant][i]}px`;
            }
        }); 
        if ('size' in props && bem?.mods?.elems)
        {
            bem.mods.elems['icnImg'].push([ 'size', props.size ]);
        }
        super({ node, props, bem });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

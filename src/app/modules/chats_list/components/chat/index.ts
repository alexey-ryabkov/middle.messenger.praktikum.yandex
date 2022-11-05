import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BemParams} from '@models/bem_block';
import {BlockProps} from '@models/block';
import Avatar from '@lib-components/avatar';
import Caption, {CaptionSize} from '@lib-components/caption';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

export type ChatProps = BlockProps & 
{
    image : string,
    name : string,
    isActive : boolean,
    datetime? : string,
    msg? : string,
    author : 'you' | null,
    tag? : 'string',
    newMsgCnt? : number
};
export default class Chat extends ComponentBlock 
{
    constructor (props : ChatProps)
    {
        const node = props?.tag ?? 'div';
        const bem : BemParams = { 
            name: 'chat', 
            mix: { block: [[ 'icontainer', [['size', 'small']] ]] }, 
            mods: { block: [] }
        };  

        if (props.isActive)
        {
            bem?.mods?.block?.push(['active']);
            
            bem?.mix?.block?.push([ 'icontainer', [['bg', 'grayLight']] ]);
            bem?.mix?.block?.push([ 'icontainer', [['dropshadow']] ]);
        }
        else
            bem?.mix?.block?.push([ 'icontainer', [['bg', 'glass']] ]);

        if (props.author)
        {
            props.msgAuthor = 'Вы';
        }
        const avatar = new Avatar({ 
            image: props.image, 
            size: 'regular'
        });
        const caption = new Caption({ 
            caption: props.name,
            size: CaptionSize.h3, 
            weight: 'Regular'  
        });

        avatar.bemMix([ 'chat', 'avatar' ]);
        caption.bemMix([ 'chat', 'name' ]); 

        super({ node, props, bem });
    }
    protected get _template () 
    {
        return template;
    }
}

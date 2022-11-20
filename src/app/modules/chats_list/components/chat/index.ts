import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BemParams} from '@core/block/bem';
import {BlockProps} from '@core/block';
import Avatar from '@lib-components/avatar';
import Caption, {CaptionSize, CaptionWeight} from '@lib-components/caption';
import tpl from './tpl.hbs';
import './style.scss';

export type ChatProps = BlockProps & 
{
    image : string,
    name : string,
    isActive : boolean,
    datetime? : string,
    msg? : string,
    author : 'you' | null,
    tag? : string,
    newMsgCnt? : number
};
export default class ChatComponent extends ComponentBlock 
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
            weight: CaptionWeight.Regular
        });

        const chatProps = {avatar, caption, ...props};

        avatar.bemMix([ 'chat', 'avatar' ]);
        caption.bemMix([ 'chat', 'name' ]); 

        super({ node, props: chatProps, bem });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

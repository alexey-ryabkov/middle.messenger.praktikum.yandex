import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BemCompParams, BemParams} from '@core/block/bem';
import {BlockProps} from '@core/block';
import Avatar from '@lib-components/avatar';
import Caption, {CaptionSize, CaptionWeight} from '@lib-components/caption';
import tpl from './tpl.hbs';
import './style.scss';

import ChatUser from '@models/chat_user';

export type ChatProps = BlockProps & 
{
    image : string,
    name : string,
    isActive : boolean,
    datetime? : string,
    msg? : string,
    msgAuthor? : 'you' | ChatUser | null,
    tag? : string,
    newMsgCnt? : number
};
export default class ChatComponent extends ComponentBlock 
{
    constructor (props : ChatProps)
    {
        const {avatar, caption} = ChatComponent._prepareProps(props);

        super( {avatar, caption, ...props}, [], { node : props?.tag ?? 'div' });
    }
    setProps (nextProps: Partial< ChatProps >)
    {
        ChatComponent._prepareProps(nextProps);

        if (nextProps.isActive)
        {
            this.addBemMods([ ['active'] ]);

            this.bemUnmix([ 'icontainer', [['bg', 'glass']] ]);

            this.bemMix([ 'icontainer', [['bg', 'grayLight']] ]);
            this.bemMix([ 'icontainer', [['dropshadow']] ]);
        }
        else
        {
            this.delBemMods([ ['active'] ]);

            this.bemUnmix([ 'icontainer', [['bg', 'grayLight']] ]);
            this.bemUnmix([ 'icontainer', [['dropshadow']] ]);

            this.bemMix([ 'icontainer', [['bg', 'glass']] ]);
        }
        super.setProps(nextProps);  
    }  
    protected static _prepareProps (props : Partial< ChatProps > = {})
    {
        if ('msgAuthor' in props)
        {
            let msgAuthorName = '';

            const msgAuthor = props.msgAuthor;
            if (msgAuthor instanceof ChatUser)
            {
                props.msgAuthorName = msgAuthor.nickname;
            }
            else if ('you' == msgAuthor)
            {
                msgAuthorName = 'Вы';
            }            
            props.msgAuthorName = msgAuthorName;
        }
        if ('image' in props)
        {
            props.avatar = new Avatar({ 
                image: props.image, 
                size: 'regular'
            });
            props.avatar.bemMix([ 'chat', 'avatar' ]);
        }
        if (props.name)
        {
            props.caption = new Caption({ 
                caption: props.name,
                size: CaptionSize.h3, 
                weight: CaptionWeight.Regular,
            });
            props.caption.bemMix([ 'chat', 'name' ]);
        }
        return props;
    }
    protected _prepareBemParams (params : BemCompParams)
    {
        const props = params.props as ChatProps;
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

        return bem;
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

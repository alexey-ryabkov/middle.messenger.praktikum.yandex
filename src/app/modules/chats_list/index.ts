import Templator from '@core/templator';
import {BemParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import IconButton from '@lib-components/icon_button';
import Icon, {IconVar} from '@lib-components/icon';
import ChatComponent, {ChatProps} from './components/chat';
import SearchComponent from './components/search';
import mount, {MountType} from '@lib-utils/mount';
import tpl from './tpl.hbs';
import './style.scss';

export type ChatsData = Record< string, ChatProps > | ChatProps;

export default class ChatsModule extends ComponentBlock
{
    constructor (chatsData : ChatsData)
    {
        const {chats} = ChatsModule._prepareProps(chatsData);

        const buttonAdd = new IconButton({ 
            icon: new Icon({ variant: IconVar.plus }), 
            size: 'regular',
            importance: 'primary'  

        }, [ 'click', () => 
        {
            console.log('add chat') 

            const login = prompt('Введите логин пользователя');
            if (login)
            {
                // TODO тут экшен
            }
        }]);

        const search = new SearchComponent(
        {
            inputName: 'search',            
        }, 
        [ 'keyup', () => console.log('type in search phrase') ]);

        super({ chats, search, buttonAdd });
    }
    setProps (chatsData : ChatsData)
    {
        const {chats} = ChatsModule._prepareProps(chatsData);

        const isSingleChat = 1 == Object.keys(chats).length;

        if (isSingleChat)
        {
            // FIXME now we need to call it twice
            this.processElems();

            const chat = Object.values(chats)[0];

            mount(chat.element, this.elems['list'], MountType.prepend);
            this.processElems();
        }
        else
            super.setProps({ chats });
    }  
    protected static _prepareProps (chatsData : ChatsData)
    {
        const props : { chats : Record< string, ChatComponent > } = { chats : {} };
        const isSingleChatData = 'name' in chatsData;

        if (isSingleChatData)
        {
            const chat = ChatsModule._createChatComponent(chatsData as ChatProps);
            props.chats[chat.id] = chat;
        }
        else
            Object.values(chatsData).forEach(chatProps => 
            {   
                const chat = ChatsModule._createChatComponent(chatProps);
                props.chats[chat.id] = chat;
            });
            
        return props;
    } 
    protected static _createChatComponent (props : ChatProps)
    {
        props.tag = 'li';

        const chat = new ChatComponent(props);
        chat.bemMix([ '_chats', 'listItem' ]);

        return chat;
    }
    protected _prepareBemParams ()
    {
        const bem : BemParams = {name: '_chats'};
        return bem;
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

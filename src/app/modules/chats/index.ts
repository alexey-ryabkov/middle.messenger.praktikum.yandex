import {PlainObject} from '@core/types';
import SurChat from '@app';
import componentConnected2store from '@flux/connect';
import Store from '@core/store';
import Templator from '@core/templator';
import {BlockProps} from '@core/block';
import {BemParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import {ChatType} from '@models/chat';
import IconButton from '@lib-components/icon_button';
import Icon, {IconVar} from '@lib-components/icon';
import Spinner from '@lib-components/spinner';
import ChatComponent, {ChatProps} from './components/chat';
import SearchComponent from './components/search';
import {datePrettify} from '@lib-utils-kit';
import tpl from './tpl.hbs';
import './style.scss';

type ChatPropsExt = ChatProps &
{
    chatId : string
}
type ChatsData = PlainObject< ChatPropsExt > | ChatPropsExt;
export type ChatsModuleProps = BlockProps & 
{
    chatsData : ChatsData,
    showLoader : boolean,
}
class ChatsModule extends ComponentBlock
{
    protected _openedChat : string | null;

    constructor (props : ChatsModuleProps)
    {
        const {chats, loader} = ChatsModule._prepareProps(props);

        const buttonAdd = new IconButton({ 
                icon: new Icon({ variant: IconVar.plus }), 
                size: 'regular',
                importance: 'primary'
            }, 
            ['click', () => 
            {
                let login = prompt('Введите логин пользователя');
                if (null !== login)
                {
                    login = login.trim();
                    if (login)
                    {
                        SurChat.instance.chatsList.createChat( login as string, ChatType.user )
                            .catch( error => 
                            {
                                console.error(error);
                                alert('При создании чата произошла ошибка') 
                            });
                    }
                    else
                        alert('Некорректный логин');
                }
            }]);

        const search = new SearchComponent(
            {
                inputName: 'search',            
            }, 
            [ 'keyup', () => console.log('type in search phrase') ]);

        super({ chats, loader, search, buttonAdd });

        this._prepareOpenChatHandler();
    }
    setProps (nextProps : Partial< ChatsModuleProps >)
    {   
        const props : Partial< ChatsModuleProps > = {};

        const {chats, loader} = ChatsModule._prepareProps(nextProps);
        
        if ('chatsData' in nextProps)
        {
            props.chats = chats ? chats : null;
        }
        if ('showLoader' in nextProps)
        {
            props.loader = loader;
        }

        super.setProps(props);
    }  
    protected static _prepareProps (props : Partial< ChatsModuleProps >)
    {   
        if ('chatsData' in props)
        {
            let chatsData = props.chatsData;
            if (chatsData && Object.keys(chatsData).length > 0)
            {
                const chats : PlainObject< ChatComponent > = {};

                const isSingleChatData = 'name' in chatsData;
                if (isSingleChatData)
                {
                    const chatProps = chatsData as ChatPropsExt;

                    chatsData = {[chatProps.chatId]: chatProps};
                }
                Object.values(chatsData as PlainObject< ChatPropsExt >).forEach(chatProps => 
                {   
                    const chat = ChatsModule._createChatComponent(chatProps, chats);
                    chats[chatProps.chatId] = chat;
                });

                props.chats = chats;
            }
            else            
                props.chats = null;
        }
        if ('showLoader' in props)
        {
            props.loader = props.showLoader
                ? new Spinner({ centered: true, color: 'dark' })
                : '';
        }        
        return props;
    } 
    protected static _createChatComponent (props : ChatPropsExt, chatComps : PlainObject< ChatComponent >)
    {
        const chatId = +props.chatId;  

        const chat = new (
                componentConnected2store< ChatProps >
                (
                    ChatComponent, 
                    () => {
                        // TODO temporary solution
                        const chatCompProps = <unknown>{...chatComps[ chatId ]?.props, chatId} as ChatPropsExt;

                        props.isActive = chatCompProps.isActive;
                        props.newMsgCnt = chatCompProps.newMsgCnt;

                        return {...ChatsModule._processChatPropsForLastMsg( chatId, props )};
                    },
                    `chats.${chatId}`
                )
            ) (null, ['click', () =>
                {
                    const {chatsList} = SurChat.instance;
                    const {activeChat} = chatsList;

                    if (activeChat?.id != chatId)
                    {
                        if (activeChat)
                        {
                            const activeChatComp = chatComps[activeChat.id];

                            activeChatComp.setProps({ isActive: false });
                        }
                        chat.setProps({ isActive: true });

                        chatsList.openChat( chatId ).catch( error => 
                        {
                            console.error(error);
                            alert('Возникла ошибка при открытии чата, попробуйте перезагрузить страницу') 
                        });
                    }                              
                }]
            );

        chat.bemMix([ '_chats', 'listItem' ]);

        return chat as ChatComponent;
    }
    protected static _processChatPropsForLastMsg (chatId : number, props : ChatPropsExt)
    {
        const app = SurChat.instance;

        const chat = app.chatsList.getChat( chatId );
        if (chat)
        {
            const {lastMessage} = chat;
            if (lastMessage)
            {
                const curUser = app.user.data;

                props = {...props, 
                    datetime: datePrettify(lastMessage.datetime), 
                    msg: lastMessage.content,
                    msgAuthor: lastMessage.userId == curUser?.id ? 'you' : null,
                    newMsgCnt: chat?.unreadCnt,
                };
            }
        }
        return props;
    }
    protected _prepareOpenChatHandler ()
    {
        const app = SurChat.instance;

        this._openedChat = null;

        app.store.on( Store.getEventName4path('openedChat'), () =>
        {
            console.log(`store.on fired, ChatsModule._prepareOpenChatHandler`, Store.getEventName4path('openedChat'));

            if (this._openedChat)
            {
                this.props.chats?.[this._openedChat]?.setProps({ isActive: false });
            }

            const {openedChat} = app.storeState; 
            this._openedChat = openedChat; 

            if (openedChat)
            {
                this.props.chats?.[openedChat].setProps(
                { 
                    isActive: true,
                    newMsgCnt: 0
                });
            }
        });
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
export default componentConnected2store< ChatsModuleProps >(ChatsModule, storeState => 
{
    const app = SurChat.instance;
    const chats = app.chatsList.list;
    const {activeChat} = app.chatsList;
    const curUser = app.user.data;

    const chatsData : ChatsData = {};
    const showLoader = storeState.showChatsLoader;

    Object.values( chats ).reduce((chatsData, chat) => 
    {
        let chatData : ChatPropsExt = 
        {
            chatId: String(chat.id),
            image: chat.avatar || '',
            name: chat.title,
            isActive : chat.id == activeChat?.id,
            newMsgCnt: chat.unreadCnt,
            tag: 'li',
        };
        const {lastMessage} = chat;
        if (lastMessage)
        {
            chatData = {
                ...chatData, 
                datetime: datePrettify(lastMessage.datetime), 
                msg: lastMessage.content,
                msgAuthor: lastMessage.userId == curUser?.id ? 'you' : null,
            };
        }
        chatsData[chatData.chatId] = chatData;
        return chatsData;
    },
    chatsData);
    
    return {chatsData, showLoader};
},
['chats', 'showChatsLoader']);

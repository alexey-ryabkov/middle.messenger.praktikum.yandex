import {Handler, PlainObject} from '@core/types';
import SurChat from '@app';
import componentConnected2store from '@flux/connect';
import Store from '@core/store';
import Templator from '@core/templator';
import {BlockProps} from '@core/block';
import {BemParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import DropdownMenu from '@lib-modules/dropdown_menu';
import InputText from '@lib-components/input-text';
import IconButton from '@lib-components/icon_button';
import Icon, {IconVar} from '@lib-components/icon';
import Spinner from '@lib-components/spinner';
import {ChatMessage} from '@entities/types';
import MessageComponent, {MessageProps, MessageTypes} from './components/message';
import {datePrettify} from '@lib-utils-kit';
import mount from '@lib-utils/mount';
import tpl from './tpl.hbs';
import './style.scss';

type MessagePropsExt = MessageProps &
{
    messageId : number
}
type MessagesData = PlainObject< MessagePropsExt > | MessagePropsExt;
type MessageGroups = PlainObject< MessageComponent[] >;

// TODO complete rework msgGroups

export type MessagesModuleProps = BlockProps & 
{
    messagesData : MessagesData,
    showLoader : boolean,
    activeChatId? : number,
}
class MessagesModule extends ComponentBlock
{
    protected _app : SurChat;
    protected _openedChat : string | null;

    constructor (props : MessagesModuleProps)
    {
        const {messages, msgGroups, loader, noActiveChat} = MessagesModule._prepareProps(props);

        const buttonSend = new IconButton({ 
            icon: new Icon({ variant: IconVar.plane }), 
            size: 'regular',
            importance: 'primary'
        }, 
        ['click', () => 
        {
            const {activeChat} = SurChat.instance.chatsList;
            if (activeChat)
            {
                const msgContent = inputSend.value.trim();
                if (msgContent)
                {
                    inputSend.value = '';
                    activeChat.sendMessage(msgContent);
                }
                else
                    alert('Сначала введите текст сообщения');
            }
            else
                alert('Сначала выберите чат');
        }]);

        const buttonAttach = new DropdownMenu(
        {
            button: new IconButton({
                icon: new Icon({ variant: IconVar.paperclip }), 
                size: 'regular',
                importance: 'secondary', 
            }),
            options: [
                // TODO attachment func
                {
                    title: 'Файл',
                    icon: IconVar.images,
                    action: () => alert('Этот функционал пока не работает'),
                },
                {
                    title: 'Стикер',
                    icon: IconVar.circle_smile,
                    action: () => alert('Этот функционал пока не работает'),
                },
                {
                    title: 'Видео',
                    icon: IconVar.camera,
                    action: () => alert('Этот функционал пока не работает'),
                },
                {
                    title: 'Локация',
                    icon: IconVar.location,
                    action: () => alert('Этот функционал пока не работает'),
                }
            ],
            position: ['bottom', 'Right']
        });
        
        const inputSend = new InputText({ 
            name: 'message', 
            placeholder: 'Сообщение',
            label: '', 
        }, 
        [ 'keyup', () => console.log('type in message') ]);

        inputSend.bemMix([ '_messages', 'messageField' ]);
        buttonSend.bemMix([ '_messages', 'messageSubmit' ]);
        buttonAttach.bemMix([ '_messages', 'attachmentDropdownMenu' ]);

        super({
            messages, 
            msgGroups,
            loader,
            inputSend, 
            buttonSend, 
            buttonAttach,
            noActiveChat,
        });

        this._app = SurChat.instance;
        this._prepareNewMsgHandler();
        this._prepareToggleLoaderHandler();
    }
    setProps (nextProps : Partial< MessagesModuleProps >)
    {
        const {messages, loader, noActiveChat} = MessagesModule._prepareProps(nextProps);

        const props : Partial< MessagesModuleProps > = {noActiveChat};
        
        if ('messagesData' in nextProps)
        {
            if (messages)
            {
                const isSingleMessage = 1 == Object.keys(messages).length;
                if (isSingleMessage)
                {
                    this.processElems();
                }
                if (isSingleMessage && this.elems['list'])
                {
                    const message = Object.values(messages)[0] as MessageComponent;

                    mount(message.element, this.elems['list']);

                    return;
                }
                else
                {
                    props.messages = messages;

                    if ('msgGroups' in nextProps)
                    {
                        props.msgGroups = nextProps.msgGroups;
                    }
                }   
            }
            else
                props.messages = null;
        }
        if ('showLoader' in nextProps)
        {
            props.loader = loader;
        }
        super.setProps(props);
    }  
    protected static _prepareProps (props : Partial< MessagesModuleProps >)
    {
        if ('messagesData' in props)
        {
            let messagesData = props.messagesData;
            if (messagesData && Object.keys(messagesData).length > 0)
            {
                const messages : PlainObject< MessageComponent > = {};
                const msgGroups : MessageComponent[] = [];//MessageGroups = {};
            
                const isSingleMsgData = 'msg' in messagesData;            
                if (isSingleMsgData)
                {
                    const messageProps = messagesData as MessagePropsExt;

                    messagesData = {[messageProps.messageId]: messageProps};
                }

                Object.values(messagesData as PlainObject< MessagePropsExt >).reverse().forEach(messageProps => 
                {   
                    const message = MessagesModule._createMessageComponent(messageProps);
                    messages[messageProps.messageId] = message;

                    // TODO group by date

                    msgGroups.push(message);
                });

                props.messages = messages;
                props.msgGroups = msgGroups;
            }
            else            
                props.messages = null;
        }
        if ('showLoader' in props)
        {
            props.loader = props.showLoader
                ? new Spinner({ centered: true, color: 'dark' })
                : '';
        }
        if ('activeChatId' in props)
        {
            props.noActiveChat = !props.activeChatId;
        }

        return props;
    } 
    protected static _createMessageComponent (props : MessagePropsExt)
    {
        const message = new MessageComponent(props);
        message.bemMix([ '_messages', 'listItem' ]);     

        return message;
    }
    protected _prepareNewMsgHandler ()
    {
        const app = SurChat.instance;

        this._openedChat = null;

        const newMsgHandler : Handler = () => 
        {   
            if (this._openedChat)
            {
                const chatId = +this._openedChat;
                
                const message = SurChat.instance.storeState.chats?.[ chatId ].lastMessage;
                if (message)
                {
                    const newMessage = { ...message, chatId, isRead: false } as ChatMessage;

                    console.log('_prepareNewMsgHandler', MessagesModule.processChatMessage2props(newMessage));

                    this.setProps({ messagesData: MessagesModule.processChatMessage2props(newMessage) });
                }
            }
        }
        app.store.on( Store.getEventName4path('openedChat'), () =>
        {
            console.log(`store.on fired, MessagesModule._prepareNewMsgHandler`, Store.getEventName4path('openedChat'));

            if (this._openedChat)
            {
                app.store.off( Store.getEventName4path(`chats.${this._openedChat}`), newMsgHandler );
            }

            const {openedChat} = app.storeState; 
            this._openedChat = openedChat;   

            if (openedChat)
            {
                app.store.on( Store.getEventName4path(`chats.${openedChat}`), () =>
                {
                    console.log(`store.on fired, newMsgHandler (MessagesModule)`, Store.getEventName4path(`chats.${openedChat}`));
                    newMsgHandler();
                 });
            }
        });
    }
    static processChatMessage2props (chatMessage : ChatMessage)
    {
        const datetime = datePrettify(chatMessage.datetime, true);        
        return {
            messageId: chatMessage.id,
            msg: chatMessage.content,
            datetime : datetime,
            time: datetime.split(' ')?.[1] || datetime,    
            of: chatMessage.userId == SurChat.instance.user.data?.id ? 'you' : 'chat',
            type: MessageTypes.text,
            tag: 'li',
        } as MessagePropsExt;
    }
    protected _prepareToggleLoaderHandler ()
    {
        this._app.store.on( Store.getEventName4path('showMessagesLoader'), () => 
        {
            console.log('store.on fired, MessagesModule._prepareToggleLoaderHandler', Store.getEventName4path('showMessagesLoader'));
            
            const showLoader = this._app.storeState.showMessagesLoader;            
            this.setProps({ showLoader });
        });
    }
    protected _prepareBemParams ()
    {
        const bem : BemParams = {name: '_messages'};
        return bem;
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
export default componentConnected2store< MessagesModuleProps >(MessagesModule, () => 
{
    const app = SurChat.instance;
    const {activeChat} = app.chatsList;

    const messagesData : MessagesData = {};

    activeChat?.messages?.reduce((messagesData, chatMessage) => 
    {
        messagesData[chatMessage.id] = MessagesModule.processChatMessage2props(chatMessage);
        return messagesData;
    },
    messagesData);

    return {messagesData, activeChatId: activeChat?.id};
},
'openedChat');

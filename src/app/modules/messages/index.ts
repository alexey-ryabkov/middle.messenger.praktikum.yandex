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
import {ChatMessage} from '@models/types';
import MessageComponent, {MessageProps, MessageTypes} from './components/message';
import {datePrettify} from '@lib-utils-kit';
import mount from '@lib-utils/mount';
import tpl from './tpl.hbs';
import './style.scss';

type MessagePropsExt = MessageProps &
{
    messageId : number
}
export type MessagesData = PlainObject< MessagePropsExt > | MessagePropsExt;
export type MessagesModuleProps = BlockProps & 
{
    messagesData : MessagesData,
    showLoader : boolean,
}
class MessagesModule extends ComponentBlock
{
    protected _openedChat : string | null;

    constructor (props : MessagesModuleProps)
    {
        const {messages, loader} = MessagesModule._prepareProps(props);

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
            loader,
            inputSend, 
            buttonSend, 
            buttonAttach
        });
        window.messages = this;

        this._prepareNewMsgHandler();
    }
    setProps (nextProps : Partial< MessagesModuleProps >)
    {
        console.log();

        const props : Partial< MessagesModuleProps > = {};

        const {messages, loader} = MessagesModule._prepareProps(nextProps);
        
        if ('messagesData' in nextProps)
        {
            if (messages)
            {
                const isSingleMessage = 1 == Object.keys(messages).length;
                if (isSingleMessage)
                {
                    // FIXME now we need to call it twice
                    this.processElems();

                    const message = Object.values(messages)[0] as MessageComponent;

                    mount(message.element, this.elems['list']);

                    this.processElems();
                }
                else
                    props.messages = messages;
            }
            else
                props.messages = null;
        }
        if ('messagesData' in nextProps)
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
                const messages : Record< string, MessageComponent > = {};
            
                const isSingleMsgData = 'msg' in messagesData;            
                if (isSingleMsgData)
                {
                    const messageProps = messagesData as MessagePropsExt;

                    messagesData = {[messageProps.messageId]: messageProps};
                }
                Object.values(messagesData).reverse().forEach(messageProps => 
                {   
                    const message = MessagesModule._createMessageComponent(messageProps);
                    messages[messageProps.messageId] = message;
                });

                props.messages = messages;
            }
            else            
                props.messages = null;
        }
        if ('showLoader' in props)
        {
            props.loader = props.showLoader
                ? new Spinner({ centered: true })
                : '';
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

                    this.setProps({ messagesData: MessagesModule.processChatMessage2props(newMessage) });
                }
            }
        }
        app.store.on( Store.getEventName4path('openedChat'), () =>
        {
            if (this._openedChat)
            {
                app.store.off( Store.getEventName4path(`chats.${this._openedChat}.lastMessage`), newMsgHandler );
            }

            const {openedChat} = app.storeState; 
            this._openedChat = openedChat;   

            if (openedChat)
            {
                app.store.on( Store.getEventName4path(`chats.${openedChat}.lastMessage`), newMsgHandler );
            }
        });
    }
    static processChatMessage2props (chatMessage : ChatMessage)
    {
        return {
            messageId: chatMessage.id,
            msg: chatMessage.content,
            datetime: datePrettify(chatMessage.datetime),    
            of: chatMessage.userId == SurChat.instance.user.data?.id ? 'you' : 'chat',
            type: MessageTypes.text,
            tag: 'li',
        } as MessagePropsExt;
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
export default componentConnected2store< MessagesModuleProps >(MessagesModule, storeState => 
{
    const app = SurChat.instance;
    const {activeChat} = app.chatsList;
    // const curUser = app.user.data;

    const messagesData : MessagesData = {};
    const showLoader = storeState.showChatsLoader;

    activeChat?.messages.reduce((messagesData, chatMessage) => 
    {
        messagesData[chatMessage.id] = MessagesModule.processChatMessage2props(chatMessage);
        return messagesData;
    },
    messagesData);

    return {messagesData, showLoader};
},
['openedChat', 'showMessagesLoader']);

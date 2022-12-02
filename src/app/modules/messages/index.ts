import SurChat from '@app';
import componentConnected2store from '@flux/connect';
import Templator from '@core/templator';
import {BlockProps} from '@core/block';
import {BemParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import DropdownMenu from '@lib-modules/dropdown_menu';
import InputText from '@lib-components/input-text';
import IconButton from '@lib-components/icon_button';
import Icon, {IconVar} from '@lib-components/icon';
import Spinner from '@lib-components/spinner';
import MessageComponent, {MessageProps} from './components/message';
import mount from '@lib-utils/mount';
import tpl from './tpl.hbs';
import './style.scss';

export type MessagesData = Record< string, MessageProps > | MessageProps;
export type MessagesModuleProps = BlockProps & 
{
    messagesData : MessagesData,
    showLoader : boolean,
}
class MessagesModule extends ComponentBlock
{
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
            const activeChat = SurChat.instance.chatsList.activeChat;
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
    }
    setProps (nextProps : Partial< MessagesModuleProps >)
    {
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
                props.messages = messages;
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
            const messagesData = props.messagesData;
            if (messagesData && Object.keys(messagesData).length > 0)
            {
                const messages : Record< string, MessageComponent > = {};
            
                const isSingleMsgData = 'msg' in messagesData;            
                if (isSingleMsgData)
                {
                    const message = MessagesModule._createMessageComponent(messagesData as MessageProps);
                    messages[message.id] = message;
                }
                else
                    Object.values(messagesData).forEach(messageProps => 
                    {   
                        const message = MessagesModule._createMessageComponent(messageProps);
                        messages[message.id] = message;
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
    protected static _createMessageComponent (props : MessageProps)
    {
        props.tag = 'li';

        const message = new MessageComponent(props);
        message.bemMix([ '_messages', 'listItem' ]);     

        return message;
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
export default componentConnected2store< MessagesData >(MessagesModule, () => 
{
    // return {messagesData: activeChat.dummyMessages as Record< string, MessageProps >};
    return {messagesData: null, showLoader: true};
});

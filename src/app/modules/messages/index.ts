import Templator from '@core/templator';
import {BemParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import InputText from '@lib-components/input-text';
import IconButton from '@lib-components/icon_button';
import Icon, {IconVar} from '@lib-components/icon';
import MessageComponent, {MessageProps} from './components/message';
import mount from '@lib-utils/mount';
import tpl from './tpl.hbs';
import './style.scss';

export type MessagesData = Record< string, MessageProps > | MessageProps;

// TODO by days grouping 
export default class MessagesModule extends ComponentBlock
{
    constructor (messagesData : MessagesData)
    {
        const {messages} = MessagesModule._prepareProps(messagesData);

        const buttonSend = new IconButton({ 
            icon: new Icon({ variant: IconVar.plane }), 
            size: 'regular',
            importance: 'primary'
        }, 
        ['click', () => console.log('send message')]);

        const buttonAttach = new IconButton({ 
            icon: new Icon({ variant: IconVar.paperclip }), 
            size: 'regular',
            importance: 'secondary'
        }, 
        ['click', () => console.log('attach smth to message')]);
        
        const inputSend = new InputText({ 
            name: 'message', 
            placeholder: 'Сообщение',
            label: '', 
        }, 
        [ 'keyup', () => console.log('type in message') ]);

        inputSend.bemMix([ '_messages', 'messageField' ]);
        buttonSend.bemMix([ '_messages', 'messageSubmit' ]);
        buttonAttach.bemMix([ '_messages', 'attachmentButton' ]);

        super({
            messagesDay: 'Сегодня',
            messages, 
            inputSend, 
            buttonSend, 
            buttonAttach
        });
        window.messages = this;
    }
    setProps (messagesData : MessagesData)
    {
        const {messages} = MessagesModule._prepareProps(messagesData);

        const isSingleMsg = 1 == Object.keys(messages).length;

        if (isSingleMsg)
        {
            // FIXME now we need to call it twice
            this.processElems();

            const message = Object.values(messages)[0];

            mount(message.element, this.elems['list']);
            this.processElems();
        }
        else
            super.setProps({ messages });
    }  
    protected static _prepareProps (messagesData : MessagesData)
    {
        const props : { messages : Record< string, MessageComponent > } = { messages : {} };
        const isSingleMsgData = 'msg' in messagesData;

        if (isSingleMsgData)
        {
            const message = MessagesModule._createMessageComponent(messagesData as MessageProps);
            props.messages[message.id] = message;
        }
        else
            Object.values(messagesData).forEach(messageProps => 
            {   
                const message = MessagesModule._createMessageComponent(messageProps);
                props.messages[message.id] = message;
            });

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

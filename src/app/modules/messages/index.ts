import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import MessageComponent, { MessageProps } from './components/message';
import InputText from '@lib-components/input-text';
import IconButton from '@lib-components/icon-button';
import Icon, {IconVar} from '@lib-components/icon';
import tpl from './tpl.hbs';

export default class MessagesModule extends ComponentBlock
{
    constructor (messagesData : Record< string, MessageProps > )
    {
        const messages : MessageComponent[] = [];

        Object.entries(messagesData).forEach(([, props]) => 
        {
            props.tag = 'li';

            const message = new MessageComponent(props);
            message.bemMix([ '_messages', 'listItem' ]);            

            messages.push(message);
        });

        const buttonSend = new IconButton({ 
            icon: new Icon({ variant: IconVar.plane }), 
            size: 'regular' 

        }, ['click', () => console.log('send message')]);

        const buttonAttach = new IconButton({ 
            icon: new Icon({ variant: IconVar.paperclip }), 
            size: 'regular',
            importance: 'secondary' 

        }, ['click', () => console.log('attach smth to message')]);
        
        const inputSend = new InputText({ name: 'message', plaseholder: 'Сообщение' });

        const props = {
            messagesDay: 'Сегодня',
            messages, 
            inputSend, 
            buttonSend, 
            buttonAttach
        };
        inputSend.bemMix([ '_messages', 'messageField' ]);
        buttonSend.bemMix([ '_messages', 'messageSubmit' ]);
        buttonSend.bemMix([ '_messages', 'attachmentButton' ]);

        super({ props, bem: {name: '_messages'} });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

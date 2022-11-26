import Templator from '@core/templator';
import {BemCompParams, BemParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import MessageComponent, {MessageProps} from './components/message';
import InputText from '@lib-components/input-text';
import IconButton from '@lib-components/icon_button';
import Icon, {IconVar} from '@lib-components/icon';
import tpl from './tpl.hbs';
import './style.scss';

export default class MessagesModule extends ComponentBlock
{
    constructor (messagesData : Record< string, MessageProps >)
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
            size: 'regular',
            importance: 'primary'  

        }, ['click', () => console.log('send message')]);

        const buttonAttach = new IconButton({ 
            icon: new Icon({ variant: IconVar.paperclip }), 
            size: 'regular',
            importance: 'secondary' 

        }, ['click', () => console.log('attach smth to message')]);
        
        const inputSend = new InputText({ 
            name: 'message', 
            placeholder: 'Сообщение',
            label: '', 
        }, [ 'keyup', () => console.log('type in message') ]);

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

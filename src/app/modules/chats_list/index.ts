import Templator from '@core/templator';
import {BemParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import ChatComponent, { ChatProps } from './components/chat';
import IconButton from '@lib-components/icon_button';
import Icon, {IconVar} from '@lib-components/icon';
import SearchComponent from './components/search';
import tpl from './tpl.hbs';
import './style.scss';

export default class ChatsModule extends ComponentBlock
{
    constructor (chatsData : Record< string, ChatProps >)
    {
        const chats : Record< string, ChatComponent > = {};

        Object.entries(chatsData).forEach(([, props]) => 
        {
            props.tag = 'li';

            const chat = new ChatComponent(props);
            chat.bemMix([ '_chats', 'listItem' ]);  

            chats[chat.id] = chat;
        });

        const search = new SearchComponent({
            inputName: 'search',
            
        }, [ 'keyup', () => console.log('type in search phrase') ]);

        const buttonAdd = new IconButton({ 
            icon: new Icon({ variant: IconVar.plus }), 
            size: 'regular',
            importance: 'primary'  

        }, [ 'click', () => console.log('add chat') ]);

        super({ chats, search, buttonAdd });
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

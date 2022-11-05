import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import ChatComponent, { ChatProps } from './components/chat';
import IconButton from '@lib-components/icon-button';
import Icon, {IconVar} from '@lib-components/icon';
import tpl from './tpl.hbs';
import SearchComponent from './components/search';

export default class ChatsModule extends ComponentBlock
{
    constructor (chatsData : Record< string, ChatProps > )
    {
        const chats : ChatComponent[] = [];

        Object.entries(chatsData).forEach(([, props]) => 
        {
            props.tag = 'li';

            const message = new ChatComponent(props);
            message.bemMix([ '_chats', 'listItem' ]);            

            chats.push(message);
        });

        const search = new SearchComponent({
            inputName: 'search',
            
        }, [ 'keyup', () => console.log('type in search phrase') ]);

        const buttonAdd = new IconButton({ 
            icon: new Icon({ variant: IconVar.plus }), 
            size: 'regular' 

        }, [ 'click', () => console.log('add chat') ]);

        const props = {
            chats, 
            search,
            buttonAdd
        };

        super({ props, bem: {name: '_chats'} });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

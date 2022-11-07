import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import ChatComponent, { ChatProps } from './components/chat';
import IconButton from '@lib-components/icon-button';
import Icon, {IconVar} from '@lib-components/icon';
import SearchComponent from './components/search';
import tpl from './tpl.hbs';
import './style.scss';

export default class ChatsModule extends ComponentBlock
{
    constructor (chatsData : Record< string, ChatProps >)
    {
        const chats : ChatComponent[] = [];

        // window.mychat = [];

        Object.entries(chatsData).forEach(([, props]) => 
        {
            props.tag = 'li';

            // console.log('1', props);

            const chat = new ChatComponent(props, 'tlen');
            chat.bemMix([ '_chats', 'listItem' ]);  
            
            // window.mychat.push(chat);

            chats.push(chat);
        });

        const search = new SearchComponent({
            inputName: 'search',
            
        }, [ 'keyup', () => console.log('type in search phrase') ]);

        const buttonAdd = new IconButton({ 
            icon: new Icon({ variant: IconVar.plus }), 
            size: 'regular',
            importance: 'primary'  

        }, [ 'click', () => console.log('add chat') ]);

        const props = {
            chats, 
            search,
            buttonAdd
        };

        window.mychats = props;
        // console.log(props);

        super({ props, bem: {name: '_chats'} });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

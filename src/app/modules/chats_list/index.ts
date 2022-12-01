import Actions from '@flux/actions';
import componentConnected2store from '@flux/connect';
import Templator from '@core/templator';
import {BlockProps} from '@core/block';
import {BemParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import IconButton from '@lib-components/icon_button';
import Icon, {IconVar} from '@lib-components/icon';
import Spinner from '@lib-components/spinner';
import ChatComponent, {ChatProps} from './components/chat';
import SearchComponent from './components/search';
import mount, {MountType} from '@lib-utils/mount';
import tpl from './tpl.hbs';
import './style.scss';

type ChatsData = Record< string, ChatProps > | ChatProps;
export type ChatsModuleProps = BlockProps & 
{
    chatsData : ChatsData,
    showLoader : boolean,
}
class ChatsModule extends ComponentBlock
{
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
                    Actions.toggleChatsLoader(true)
                        .then( () => Actions.createUserChat(login as string) )
                        .catch(() => 
                        {
                            // TODO операция не выполнена или пользователь не найден 
                        })
                        .finally( () => Actions.toggleChatsLoader(false) );
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
    }
    setProps (nextProps : Partial< ChatsModuleProps >)
    {   
        const props : Partial< ChatsModuleProps > = {};

        const {chats, loader} = ChatsModule._prepareProps(nextProps);
        
        if ('chatsData' in nextProps)
        {
            if (chats)
            {
                const isSingleChat = 1 == Object.keys(chats).length;
                if (isSingleChat)
                {
                    // FIXME now we need to call it twice
                    this.processElems();

                    const chat = Object.values(chats)[0] as ChatComponent;

                    mount(chat.element, this.elems['list'], MountType.prepend);

                    this.processElems();
                }
                else
                    props.chats = chats;
            }
            else
                props.chats = chats;
        }
        if ('chatsData' in nextProps)
        {
            props.loader = loader;
        }

        super.setProps(props);
    }  
    protected static _prepareProps (props : Partial< ChatsModuleProps >)
    {   
        if ('chatsData' in props)
        {
            const chatsData = props.chatsData;
            if (chatsData && Object.keys(chatsData).length > 0)
            {
                const chats : Record< string, ChatComponent > = {};
            
                const isSingleChatData = 'name' in chatsData;            
                if (isSingleChatData)
                {
                    const chat = ChatsModule._createChatComponent(chatsData as ChatProps);
                    chats[chat.id] = chat;
                }
                else
                    Object.values(chatsData).forEach(chatProps => 
                    {   
                        const chat = ChatsModule._createChatComponent(chatProps);
                        chats[chat.id] = chat;
                    });

                props.chats = chats;
            }
            else            
                props.chats = null;
        }
        if ('showLoader' in props)
        {
            props.loader = props.showLoader
                ? new Spinner({ centered: true })
                : '';
        }        
        return props;
    } 
    protected static _createChatComponent (props : ChatProps)
    {
        props.tag = 'li';

        const chat = new ChatComponent(props);
        chat.bemMix([ '_chats', 'listItem' ]);

        return chat;
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
    return {chatsData: storeState.chats, showLoader: storeState.showChatsLoader};
},
['chats', 'showChatsLoader']);

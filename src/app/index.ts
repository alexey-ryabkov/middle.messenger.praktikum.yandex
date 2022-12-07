
import {App, AppContainer} from '@core/types';
import Page, {PageAccess} from '@core/page';
import Router from '@core/router';
import Store, {StoreEvents} from '@core/store';
import Actions from '@flux/actions';
import {AppStoreScheme} from '@models/types';
import ChatsList from '@models/chats_list'; 
import CurrentUser from '@models/current_user';
import MainContainer from '@app-modules/main';
import Spinner from '@lib-components/spinner';
import { cloneDeep } from '@lib-utils-kit';


// FIXME too many logic in the class:
// localize routing in AppRouter extends Router
// work with store in AppStore extends Store
// mb localize user define func in @models/user

export default class SurChat implements App
{
    static readonly NAME = 'Sur chat';
    static readonly AUTH_PAGE_NAME = 'sign-in';
    static readonly CHAT_PAGE_NAME = 'messenger';
    static readonly FALLBACK_PAGE_NAME = 'error404';
    static readonly ERROR_PAGE_NAME = 'error500';

    protected static readonly _INIT_STORE_STATE : AppStoreScheme = {
        currentUser: null,
        chats: {}, 
        openedChat: null,
        chatUsers: {},
        showChatsLoader : false,
        showMessagesLoader : false,
        // TODO 
        openedPage : null,
    };
    protected static readonly _INITIALIZE_MSG = 'Загрузка приложения...';    
    protected static readonly _ROOT_NODE = document.body;    

    protected _container : AppContainer; 
    protected _router : Router;
    protected _store : Store;
    protected _chatsList : ChatsList;
    protected _user : CurrentUser;
    protected _isUserDefined = false;

    private static _instance : SurChat;

    private constructor ()
    {
        this.title = SurChat._INITIALIZE_MSG;
        this._container = new MainContainer( SurChat._ROOT_NODE, new Spinner({ size: 'large' })).mount(); 
        
        this._router = new Router();
        this._store = new Store( SurChat._initStoreState, `${SurChat.NAME} store` );

        this._user = new CurrentUser(this);
        this._chatsList = new ChatsList(this); 

        this._store.oneTime(Store.getEventName4path('currentUser'), () => 
        {
            console.log('store.on fired, SurChat.constructor', Store.getEventName4path('currentUser'));

            const isUserAuthorized = this.user.isAuthorized;

            const isUserBecameAuthorized = !this._isUserDefined && isUserAuthorized;
            if (isUserBecameAuthorized)
            {
                this._loadChats();
            }
            this._isUserDefined = isUserAuthorized;
        });
    }

    static get instance ()
    {
        return this._instance || (this._instance = new this());
    }
    protected set title (title : string)
    {
        // TODO move it to AppRouter, when it becomes
        title = '';
        document.title = `${SurChat.NAME}${title ? ': '+title : ''}`; 
    }
    get root ()
    {
        return SurChat._ROOT_NODE;
    }
    get container ()
    {
        return this._container;
    }

    get store ()
    {
        return this._store;
    }
    get storeState ()
    {
        const isStateCleared = 0 == Object.keys(this._store.state).length;

        return !isStateCleared 
            ? this._store.state as AppStoreScheme
            : SurChat._initStoreState;
    }
    resetStoreState ()
    {
        this._store.init( SurChat._initStoreState );
    }
    protected static get _initStoreState ()
    {
        return cloneDeep(SurChat._INIT_STORE_STATE) as AppStoreScheme;
    }

    get user ()
    {
        return this._user;
    }
    get isUserAuthorized ()
    {
        return this.user.isAuthorized;
    }
    get chatsList ()
    {
        return this._chatsList;
    }

    set pages (pages : Page[])
    {
        pages.forEach( page => this._router.use(page) );
    }
    get page ()
    {
        return this._router.currentRoute;
    }
    init ()
    {
        this._prepareLinks4routing();
        this._prepareAuthRedirects();
        
        if (!this._redirectIfNoAccess(this._router.curPathname) && !this._router.start())
        {
            this._router.go( Page.url( SurChat.FALLBACK_PAGE_NAME ));
        }
    }
    go2url (url : string)
    {      
        if (!this._redirectIfNoAccess(url) && !this._router.go(url))
        {
            this._router.go( Page.url( SurChat.FALLBACK_PAGE_NAME ));
        }
    }
    go2page (name : string) 
    {
        this.go2url( Page.url(name) );
    }
    protected _redirectIfNoAccess (url : string)
    {   
        const page = this._router.getRoute(url) as Page | null;

        if (!page)
        {
            return false;
        } 
        if (!this._isUserDefined && page.access == PageAccess.authorized)
        {
            return this._router.go( Page.url( SurChat.AUTH_PAGE_NAME ));
        }
        else if (this._isUserDefined && page.access == PageAccess.nonAuthorized)
        {
            return this._router.go( Page.url( SurChat.CHAT_PAGE_NAME ));
        }
        return false;
    }    
    protected _prepareAuthRedirects ()
    {
        this._store.on( Store.getEventName4path('currentUser'), () => 
        {
            console.log('store.on fired, SurChat._prepareAuthRedirects', Store.getEventName4path('currentUser'));

            const isUserAuthorized = this.user.isAuthorized;

            const isUserBecameAuthorized = !this._isUserDefined && isUserAuthorized;
            const isUserBecameUnknown = this._isUserDefined && !isUserAuthorized;

            if (isUserBecameUnknown)
            {
                this._router.go( Page.url( SurChat.AUTH_PAGE_NAME ));
            }
            else if (isUserBecameAuthorized)
            {
                this._loadChats();
                this._router.go( Page.url( SurChat.CHAT_PAGE_NAME ));                
            }
            this._isUserDefined = isUserAuthorized;
        });
    }
    protected _loadChats ()
    {
        Actions.toggleChatsLoader(false)
            .then( () => Actions.getChatsList() )
            .finally( () => Actions.toggleChatsLoader(false) );
    }
    protected _prepareLinks4routing ()
    {
        SurChat._ROOT_NODE.addEventListener('click', event =>
        {
            const element = event.target as Element;

            if ('A' == element.tagName) 
            {
                event.preventDefault();

                const url = element.getAttribute('href');
                if (url)
                {
                    this.go2url(url);
                }        
            }
        });
    }
}
window.app = SurChat.instance;

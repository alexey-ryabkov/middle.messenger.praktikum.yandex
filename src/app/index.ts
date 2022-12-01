
import {App, AppContainer} from '@core/types';
import Page, {PageAccess} from '@core/page';
import Router from '@core/router';
import Store, { StoreEvents } from '@core/flux/store';
import {AppStoreScheme} from '@models/types';
import ChatsList from '@models/chats_list'; 
import CurrentUser from '@models/current_user';
import MainContainer from '@app-modules/main';
import Spinner from '@lib-components/spinner';
import { cloneDeep } from '@lib-utils-kit';

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

    private constructor()
    {
        this.title = SurChat._INITIALIZE_MSG;
        this._container = new MainContainer( SurChat._ROOT_NODE, new Spinner({ size: 'large' }) ).mount(); 
        
        this._router = new Router();

        this._store = new Store( SurChat._initStoreState, `${SurChat.NAME} store` );

        this._store.oneTime(Store.getEventName4path('currentUser'), () => 
        {
            const {currentUser} = this.storeState;

            // console.log('one time currentUser handler');
            return this._isUserDefined = !!currentUser;
        });

        this._user = new CurrentUser(this);
        this._chatsList = new ChatsList(this); 
    }

    static get instance ()
    {
        return this._instance || (this._instance = new this());
    }
    protected set title (title : string)
    {
        title = title.trim();
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
        // TODO mb HOC to forbid use Store.state & Store.get instead storeState below
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

    // TODO убрать весь сахар: .page .go2page ? 
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
        // console.log('app init');
        
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
    protected _prepareAuthRedirects ()
    {
        this._store.on( Store.getEventName4path('currentUser'), () => 
        {
            const {currentUser} = this.storeState;
            
            // console.log('and now will redirect!', this._isUserDefined, currentUser);

            if (this._isUserDefined && null === currentUser)
            {
                this._router.go( Page.url( SurChat.AUTH_PAGE_NAME ));
            }
            else if (!this._isUserDefined && currentUser)
            {
                this._router.go( Page.url( SurChat.CHAT_PAGE_NAME ));
            }
            this._isUserDefined = !!currentUser;
        });
    }
}
window.app = SurChat.instance;

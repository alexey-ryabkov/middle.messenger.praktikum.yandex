
import {App, AppContainer, Nullable} from '@core/types';
import Page, {PageAccess} from '@core/page';
import Router from '@core/router';
import ChatList from '@models/chat_list';
import CurrentUser from '@models/user';
import Store from '@core/state/store';
import userApi from '@api/user';
import MainContainer from '@app-modules/main';
import ChatUser from '@models/chat_user';
import Spinner from '@lib-components/spinner';
import { ProfileData } from '@models/types';

export default class SurChat implements App
{
    static readonly NAME = 'Sur chat';
    static readonly AUTH_PAGE_NAME = 'sign-in';
    static readonly CHAT_PAGE_NAME = 'messenger';
    static readonly FALLBACK_PAGE_NAME = 'error404';
    static readonly ERROR_PAGE_NAME = 'error500';

    protected static readonly _INITIALIZE_MSG = 'Загрузка приложения...';    
    protected static readonly _ROOT_NODE = document.body;

    protected _container : AppContainer; 
    protected _router : Router;
    protected _store : Store;
    protected _chatsList : ChatList;
    protected _user : Nullable< CurrentUser > = null;
    // TODO isUserAuthorized 
    protected _isUserDefined = false;

    private static _instance : SurChat;

    private constructor()
    {
        // FIXME 
        // console.log(Math.random());
        
        this._container = new MainContainer( SurChat._ROOT_NODE, new Spinner({ size: 'large' }) ).mount(); 
        this.title = SurChat._INITIALIZE_MSG;

        this._router = new Router();
        this._store = new Store();

        // TODO привести к единообразию - где-то currentUser ге-то profile         
        this._store.oneTime('updated:current_user', currentUser => 
        {
            console.log('oneTime updated:current_user', currentUser);
            return this._isUserDefined = !!currentUser
        });

        this._user = new CurrentUser();
        this._chatsList = new ChatList();    

        // window.addEventListener('popstate', ((event : PopStateEvent) => 
        // {
        //     console.log('onpopstate in app', event.state, event);

        //     const url = (event.currentTarget as Window).location.pathname;

        //     this._redirectIfNoAccess(url);
        // })
        // .bind(this));

        // TODO неплохо бы убирать в подметоды 
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
    get chatsList ()
    {
        return this._chatsList;
    }
    get user ()
    {
        return this._user;
    }
    get store ()
    {
        return this._store;
    }
    // get router ()
    // {
    //     return this._router;
    // }
    // logoutUser ()
    // {
    //     this._user = null;
    //     // TODO тогда chatList, котором передается пользователь также обнуляется? 


    //     this.go2page( SurChat.AUTH_PAGE_NAME );
    // }
    // TODO убрать весь сахар, который не используется по факту, итак класс объемный по функционалу 
    get page ()
    {
        return this._router.currentRoute;
    }
    set pages (pages : Page[])
    {
        pages.forEach( page => this._router.use(page) );
    }
    init ()
    {
        if (!this._redirectIfNoAccess(this._router.curPathname) && !this._router.start())
        {
            this._router.go( Page.url( SurChat.FALLBACK_PAGE_NAME ));
        }

        this._store.on('updated:current_user', currentUser => 
        {
            console.log('on updated:current_user', currentUser);
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
    go2url (url : string)
    {      
        // TODO по идее нужно показывать 403 ошибку...  
        if (!this._redirectIfNoAccess(url) && !this._router.go(url))
        {
            this._router.go( Page.url( SurChat.FALLBACK_PAGE_NAME ));
        }
    }
    go2page (name : string) 
    {
        this.go2url( Page.url(name) );
    }

    // TODO checkAccess methid for Page, need public isUserDefined 
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
}
window.app = SurChat.instance;

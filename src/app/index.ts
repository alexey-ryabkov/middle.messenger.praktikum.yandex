
import {App, AppContainer, Nullable} from '@core/types';
import Page, {PageAccess} from '@core/page';
import Router from '@core/router';
import ChatList from '@models/chat_list';
import CurrentUser from '@models/user';
import {Store} from '@core/state/store';
import userApi from '@api/user';
import MainContainer from '@app-modules/main';
import ChatUser from '@models/chat_user';
import Spinner from '@lib-components/spinner';

export default class SurChat implements App
{
    static readonly NAME = 'Sur chat';
    static readonly AUTH_PAGE_NAME = 'sign-in';
    static readonly CHAT_PAGE_NAME = 'messenger';
    static readonly FALLBACK_PAGE_NAME = 'error404';
    static readonly ERROR_PAGE_NAME = 'error500';
    protected static readonly INITIALIZE_MSG = 'Загрузка приложения...';
    
    protected _root : HTMLElement;
    protected _container : AppContainer; 
    protected _router : Router;
    protected _store : Store;
    protected _chatsList : ChatList;
    protected _user : Nullable< CurrentUser > = null;

    private static _instance: SurChat;

    private constructor()
    {
        this._root = document.body;    
        
        // const spinner = new Spinner({ size: 'large' });
        // console.log(spinner, spinner.element);

        this._container = new MainContainer( this._root, new Spinner({ size: 'large' }) ).mount(); 
        this.title = SurChat.INITIALIZE_MSG;

        this._router = new Router();
        this._store = new Store();

        userApi.getProfile() 
            .then(profile => 
            {
                // new ChatUser(profile);
            });

        this._user = new CurrentUser(this._store);
        this._chatsList = new ChatList();        
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
        return this._root;
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
    logoutUser ()
    {
        this._user = null;
        // TODO тогда chatList, котором передается пользователь также обнуляется? 

        

        this.go2page( SurChat.AUTH_PAGE_NAME );
    }
    // get store ()
    // {
    //     return this._store;
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
        if (!this.redirectIfNoAccess(this._router.curPathname) && !this._router.start())
        {
            this._router.go( Page.url( SurChat.FALLBACK_PAGE_NAME ));
        }
    }
    go2url (url : string)
    {        
        if (!this.redirectIfNoAccess(url) && !this._router.go(url))
        {
            this._router.go( Page.url( SurChat.FALLBACK_PAGE_NAME ));
        }
    }
    go2page (name : string) 
    {
        this.go2url( Page.url(name) );
    }
    protected redirectIfNoAccess (url : string)
    {   
        const page = this._router.getRoute(url) as Page;

        if (!this._user && page.access == PageAccess.authorized)
        {
            return this._router.go( Page.url( SurChat.AUTH_PAGE_NAME ));
        }
        else if (this._user && page.access == PageAccess.nonAuthorized)
        {
            return this._router.go( Page.url( SurChat.CHAT_PAGE_NAME ));
        }
        return false;
    }
}

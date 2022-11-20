import MainContainer from '@app-modules/main';
import Page from '@core/page';
import Router from '@core/router';
import ChatList from '@models/chat_list';
import User from '@models/user';
import { Store } from '@core/state/store';
import {App, AppContainer, Nullable} from '@core/types';

export default class SurChat implements App
{
    static readonly NAME = 'Sur chat';

    protected static readonly DEFAULT_PAGE = 'auth';
    protected static readonly FALLBACK_PAGE = 'error404';
    protected static readonly INITIALIZE_MSG = 'Загрузка приложения...';
    
    protected _root : HTMLElement;
    protected _container : AppContainer; 
    protected _router : Router;
    protected _store : Store;
    protected _chatsList : ChatList;
    protected _user : Nullable< User > = null;

    private static _instance: SurChat;

    private constructor()
    {
        this._root = document.body;         
        this._container = new MainContainer(this._root, SurChat.INITIALIZE_MSG).mount(); 
        this.title = SurChat.INITIALIZE_MSG;

        this._router = new Router();
        this._store = new Store();
        this._user = new User(this._store);
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
        if (!this._router.start())
        {
            this._router.go( Page.url( SurChat.FALLBACK_PAGE ));
        }
    }
    go2url (url : string)
    {
        if (!this._router.go(url))
        {
            this._router.go( Page.url( SurChat.FALLBACK_PAGE ));
        }
    }
    go2page (name : string) 
    {
        this.go2url( Page.url(name) );
    }
}

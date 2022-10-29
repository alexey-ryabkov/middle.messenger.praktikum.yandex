import MainContainer from '@app-modules/main';
import Page from '@models/page';
import ChatList from '@models/chat_list';
import User from '@models/user';
import {App, AppContainer, Nullable} from '@models/types';

export default class SurApp implements App
{
    static readonly NAME = 'Sur chat';
    protected static readonly INITIALIZE_MSG = 'Загрузка приложения...';
    
    protected _root : HTMLElement;
    protected _container : AppContainer; 
    protected _page : Page;
    protected _chatsList : ChatList;
    protected _user : Nullable< User > = null;

    // TODO "авторизация" пользователя
    // и инициация его чатов
    // интерфейс http транспорта

    private static _instance: SurApp;

    private constructor()
    {
        this._root = document.body;         
        this._container = new MainContainer(this._root, SurApp.INITIALIZE_MSG).mount(); 
        this.title = SurApp.INITIALIZE_MSG;
    }

    static get instance ()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
    
    // constructor (token : Symbol)  
    // {        
    //     if (APP_SINGLETON_TOKEN !== token)
    //     {
    //         throw new Error('This class cannot instantiate directly')
    //     } 
    //     this._root = document.body;         
    //     this._container = new MainContainer(this._root, INITIALIZE_MSG).mount(); 
    //     this.title = INITIALIZE_MSG;
    // }    
    // static get instance () 
    // {        
    //     if (!this[APP_SINGLETON_TOKEN])
    //     {
    //         this[APP_SINGLETON_TOKEN] = new SurApp(APP_SINGLETON_TOKEN);
    //     }
    //     return this[APP_SINGLETON_TOKEN];
    // }
    protected set title (title : string)
    {
        title = title.trim();
        document.title = `${SurApp.NAME}${title ? ': '+title : ''}`; 
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
    set page (page : Page)
    {
        if (this._page)
        {
            this._page.unmount();
        }
        this._page = page.mount();
        this.title = this._page.title;
    }
    get page ()
    {
        return this._page;
    }
}

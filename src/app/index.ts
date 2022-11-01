import MainContainer from '@app-modules/main';
import Page from '@models/page';
import ChatList from '@models/chat_list';
import User from '@models/user';
import { Nullable } from '@models/types';

const INITIALIZE_MSG = 'Загрузка приложения...';
const APP_SINGLETON_TOKEN = Symbol();

export default class App 
{
    static readonly NAME = 'Sur chat';
    
    protected _container : MainContainer; 
    protected _page : Page;
    protected _chatsList : ChatList;
    protected _user : Nullable< User > = null;

    // @todo "авторизация" пользователя
    // и инициация его чатов
    // интерфейс http транспорта
    
    constructor (token : Symbol)  
    {        
        if (APP_SINGLETON_TOKEN !== token)
        {
            throw new Error('This class cannot instantiate directly')
        }          
        this._container = new MainContainer(INITIALIZE_MSG).mount(); // @todo контейнер тоже нужно инициализировать 
        this.title = INITIALIZE_MSG;
    }    
    static get instance () 
    {        
        if (!this[APP_SINGLETON_TOKEN])
        {
            this[APP_SINGLETON_TOKEN] = new App(APP_SINGLETON_TOKEN);
        }
        return this[APP_SINGLETON_TOKEN];
    }
    protected set title (title : string)
    {
        title = title.trim();
        document.title = `${App.NAME}${title ? ': '+title : ''}`; 
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
        this._page = page.mount();
        this.title = this._page.title;
    }
    get page ()
    {
        return this._page;
    }
}

import MainContainer from './modules/main';
import Page from './models/page';
import ChatList from './models/chat_list';
import User from './models/user';
import { Nullable } from '../lib/models/types';

const INITIALIZE_MSG = 'Загрузка приложения...';
const APP_SINGLETON_TOKEN = Symbol();

// @todo в какой момент маунтится верстка контейнера?
// а страниц? 

export default class App 
{
    static readonly NAME = 'Sur chat';
    
    protected _title : string;
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
        this._container = new MainContainer(INITIALIZE_MSG);
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
    get title ()
    {
        return this._title;
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
        this._page = page;
        this._container.page = page;
        this.title = this._page.title;
    }
    // render ()
    // {
    //     this.props.page = this._page?.render() ?? '';
    //     return super.render();
    // }
    // mount () // @todo перемонтировать главный модуль (со всем его содержимым)
    // {
    //     // return super.mount(document.body);
    // }
}

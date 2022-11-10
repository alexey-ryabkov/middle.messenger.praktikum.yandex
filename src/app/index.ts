import MainContainer from '@app-modules/main';
import Page from '@models/page';
import ChatList from '@models/chat_list';
import User from '@models/user';
import {App, AppContainer, Nullable} from '@models/types';

export default class SurChat implements App
{
    static readonly NAME = 'Sur chat';
    protected static readonly INITIALIZE_MSG = 'Загрузка приложения...';
    
    protected _root : HTMLElement;
    protected _container : AppContainer; 
    protected _page : Page;
    protected _chatsList : ChatList;
    protected _user : Nullable< User > = null;

    private static _instance: SurChat;

    private constructor()
    {
        this._root = document.body;         
        this._container = new MainContainer(this._root, SurChat.INITIALIZE_MSG).mount(); 
        this.title = SurChat.INITIALIZE_MSG;

        this._user = new User();
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

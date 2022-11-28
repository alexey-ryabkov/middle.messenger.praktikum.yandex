import {PlainObject} from "@core/types";
import SurChat from "@app";
import Chat from "@models/chat";
import chats from '@data/chats.json'; 
import DummyChat from "@models/dummy_chat";

export default class ChatsList 
{
    protected _chats : PlainObject< Chat > = {};

    constructor (
        protected _app : SurChat
    ) {
        this._processChats();
        this._app.store.on('updated:chats', () => this._processChats());
    }
    protected _processChats ()
    {
        const curChatIds = Object.keys(this._chats);
        const storeChatIds = Object.keys(this._app.storeState.chats);
        const addChatIds : string[] = storeChatIds.filter(id => !curChatIds.includes(id));
        const delChatIds : string[] = curChatIds.filter(id => !storeChatIds.includes(id));
        
        addChatIds.forEach(id => { this._chats[id] = new Chat( this._app, this._app.storeState.chats[id] ) });
        delChatIds.forEach(id => 
        { 
            this._chats[id].onDelete(); 
            delete this._chats[id];
        });
    }
    get list ()
    {
        return this._chats;
    }
    get activeChat ()
    {
        const id = this._app.storeState.openedChat;

        if (id)
        {
            return this.getChat(Number(id));
        }
        return null;
    }
    getChat (chatId : number)
    {
        const id = String(chatId);

        if (!(id in this._chats))
        {
            return this._chats[id];
        }
        return null;
    }
    // TODO below depricated 
    get dummyList ()
    {
        // parcel can ref to image, only if it static string
        // so we can`t do it dynamically (get image from json)  
        if (chats['chat1'])
        {
            const chat1imageUrl = new URL(
                '../../../static/images/hatt.jpg',
                import.meta.url
            );
            chats['chat1'].image = chat1imageUrl.pathname;
        }
        if (chats['chat2'])
        {
            const chat2imageUrl = new URL(
                '../../../static/images/grimes.jpg',
                import.meta.url
            );
            chats['chat2'].image = chat2imageUrl.pathname;
        }
        if (chats['chat3'])
        {
            const chat3imageUrl = new URL(
                '../../../static/images/michael.jpg',
                import.meta.url
            );
            chats['chat3'].image = chat3imageUrl.pathname;
        }
        return chats;
    }
    get dummyActiveChat ()
    {
        return new DummyChat();
    }
}

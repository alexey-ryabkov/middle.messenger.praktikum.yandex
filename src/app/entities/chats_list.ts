import {PlainObject} from "@core/types";
import SurChat from "@app";
import Store from "@core/store";
import Actions from "@flux/actions";
import {AppErrorCode} from "@entities/types";
import Chat, { ChatType } from "@entities/chat";
import {createAppError} from "@app-utils-kit";
import dummyChats from '@data/chats.json'; 
import DummyChat from "@entities/dummy_chat";

export default class ChatsList 
{
    protected _chats : PlainObject< Chat > = {};

    constructor (
        protected _app : SurChat
    ) {
        this._processChats();
        
        this._app.store.on( Store.getEventName4path('chats'), () => 
        {
            console.log('store.on fired, ChatsList.constructor', Store.getEventName4path('chats'));
            this._processChats(); 
        });

        // open chat at start after got chats in store
        this._app.store.oneTime( Store.getEventName4path('chats'), () => 
        {
            console.log('store.oneTime fired, ChatsList.constructor', Store.getEventName4path('chats'));

            this._openNextChat()
                .then( () => Actions.toggleMessagesLoader(false) );
        });
    }    
    get chats ()
    {
        return this._chats;
    }
    get activeChat ()
    {
        const chatId = this._app.storeState.openedChat;

        if (chatId)
        {
            return this.getChat(+chatId);
        }
        return null;
    }
    getChat (chatId : number)
    {
        if (chatId in this._chats)
        {
            return this._chats[chatId];
        }
        return null;
    }
    createChat (loginOrTitle : string, type : ChatType)
    {
        return Actions.toggleChatsLoader(true)
            .then(() =>
            {
                if (ChatType.user == type)
                {
                    const login = loginOrTitle;
                    return Actions.createUserChat(login);
                }
                else
                {
                    const title = loginOrTitle;
                    return Actions.createGroupChat(title);
                }
            })
            .then(chatId => 
            {
                if (chatId)
                {
                    const chat = this.getChat(chatId);
                    if (chat)
                    {
                        return chat.init().then( () => Actions.openChat(chatId) );
                    }
                }
            })
            .finally( () => Actions.toggleChatsLoader(false) );
    }
    openChat (chatId : number)
    {
        const {activeChat} = this;
        const chat2open = this.getChat(chatId);

        if (chat2open)
        {
            if (activeChat?.id != chat2open.id)
            {
                return Actions.toggleMessagesLoader(true)
                    .then( () => chat2open.init() )
                    .then(() => 
                    {
                        if (activeChat)
                        {
                            return Actions.closeChat( activeChat.id );
                        }
                    })
                    .then( () => chat2open.loadMessages() )
                    .then( () => Actions.openChat(chatId) ) 
                    .finally( () => Actions.toggleMessagesLoader(false) );
            }
            return Promise.resolve();
        }
        else
            return Promise.reject( createAppError(`unknown chat ${chatId}`, AppErrorCode.dev, 'ChatsList.openChat') );
    }
    deleteChat (chatId : number)
    {
        if (chatId in this._chats)
        {
            return Actions.toggleChatsLoader(true)
                .then( () => Actions.deleteChat(chatId) )
                .then( () => Actions.closeChat(chatId) )
                .then( () => this._openNextChat() )
                .finally( () => Actions.toggleChatsLoader(false) );    
        }
        return Promise.reject( createAppError(`unknown chat ${chatId}`, AppErrorCode.dev, 'ChatsList.openChat') ); 
    }
    protected _openNextChat ()
    {
        const chat2open = this._getChat2openNext();
        if (chat2open)
        {
            return this.openChat( chat2open.id );
        }
        return Promise.resolve();
    }
    protected _getChat2openNext ()
    {
        return Object.values(this._chats).reduce((chat2open, chat) => 
        {
            let resChat2open : Chat | null = chat2open;

            if (resChat2open)
            {
                const chatlastMsg = chat.lastMessage;
                const chat2openlastMsg = (resChat2open as Chat).lastMessage;

                if (chatlastMsg && 
                (
                    !chat2openlastMsg
                    || 
                    chatlastMsg.datetime > chat2openlastMsg.datetime
                )) {
                    resChat2open = chat;
                }
            }
            else
                resChat2open = chat;
            
            return resChat2open;
        }, 
        null);
    }
    protected _processChats ()
    {
        const curChatIds = Object.keys(this._chats);
        const storeChatIds = Object.keys(this._app.storeState.chats);
        
        const addChatIds : string[] = storeChatIds.filter(id => !curChatIds.includes(id));
        const delChatIds : string[] = curChatIds.filter(id => !storeChatIds.includes(id));
        
        addChatIds.forEach(id => { this._chats[id] = new Chat( this._app, this._app.storeState.chats[id] )});
        delChatIds.forEach(id => 
        { 
            this._chats[id].onDelete(); 
            delete this._chats[id];
        });
    }
    // TODO below depricated 
    get dummyList ()
    {
        // parcel can ref to image, only if it static string
        // so we can`t do it dynamically (get image from json)  
        // if (dummyChats['chat1'])
        // {
        //     const chat1imageUrl = new URL(
        //         '../../../static/images/hatt.jpg',
        //         import.meta.url
        //     );
        //     dummyChats['chat1'].image = chat1imageUrl.pathname;
        // }
        // if (dummyChats['chat2'])
        // {
        //     const chat2imageUrl = new URL(
        //         '../../../static/images/grimes.jpg',
        //         import.meta.url
        //     );
        //     dummyChats['chat2'].image = chat2imageUrl.pathname;
        // }
        // if (dummyChats['chat3'])
        // {
        //     const chat3imageUrl = new URL(
        //         '../../../static/images/michael.jpg',
        //         import.meta.url
        //     );
        //     dummyChats['chat3'].image = chat3imageUrl.pathname;
        // }
        return dummyChats;
    }
    get dummyActiveChat ()
    {
        return new DummyChat();
    }
}

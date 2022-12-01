import {PlainObject} from "@core/types";
import {AppError, AppErrorCode, AuthorizeData, ChangeAuthData, ChatFields, ChatUserFields, 
    Message, ProfileData, RegistrateData} from "@models/types";
import SurChat from "@app";
import {apiErrorHandler} from "@api/rest";
import chatsApi from "@api/chats";
import userApi from "@api/user";
import ChatUser from "@models/chat_user";
import Chat from "@models/chat";
import {isEqual} from "@lib-utils-kit";
import {createAppError} from "@app-utils-kit";
import { StoreSetStateType } from "@core/store";

// TODO если мы авторизуемся авторматом после регистрации нужен ли defineUser ?

export default class Actions 
{
    static defineUser ()
    {
        return userApi.getProfile()                
            .then( profile => Actions._processProfileData(profile) )
            .catch( error => apiErrorHandler(error) );
    }
    static createUser (data : RegistrateData)
    {
        return userApi.registrate(data).then( () => Actions.defineUser() );
    }
    static authorizeUser (data : AuthorizeData)
    {
        return userApi.authorize(data).then( () => Actions.defineUser() );
    }
    static changeUserProfile (data : ProfileData)
    {
        return userApi.setProfile(data).then( () => Actions.defineUser() );
    }
    static changeUserAuthData (data : ChangeAuthData)
    {
        return userApi.changeAuthData(data).then( () => Actions.defineUser() );
    }
    static logoutUser ()
    {
        return userApi.logout().then( () => Actions.defineUser() );
    }       
    static getChatsList ()
    {   
        const app = SurChat.instance;
        const curUser = app.user.data;

        if (!curUser)
        {
            return Promise.reject( createAppError('no current user', AppErrorCode.default, 'Actions.getChatsList') );
        }
        return chatsApi.getChatsList()
            .then(rawChats =>
            {
                const chats : PlainObject< ChatFields > = {};

                rawChats.reduce((chats, chat) =>
                {
                    // rest api don`t give us userId by login ( /user/search ) for current user. so fix it here
                    if (chat.lastMessage && !chat.lastMessage.userId)
                    {
                        chat.lastMessage.userId = curUser.id ?? 0;
                    }                    
                    chats[String(chat.id)] = chat;
                    return chats;
                }, 
                chats);

                if (!isEqual(chats, app.storeState.chats))
                {
                    app.store.set('chats', chats, StoreSetStateType.replace);
                }
            })
            .catch( error => apiErrorHandler(error) )
            .finally( () => Actions.toggleChatsLoader(false) );
    } 
    static createUserChat (login : string)
    {
        const curUser = SurChat.instance.user.data;

        if (!curUser)
        {
            return Promise.reject( createAppError('no current user', AppErrorCode.default, 'Actions.createUserChat') );
        }
        return userApi.search(login)
            .then(users =>
            {
                if (users.length)
                {
                    const chatUser = new ChatUser(users[0]);

                    return chatsApi.addUserChat( chatUser.id, Chat.getUserChatName(curUser, chatUser) );
                }
                else
                    throw createAppError(`Пользователь с логином ${login} не найден`, AppErrorCode.default, 'createUserChat action');
            })    
            .then(chatId => 
            {
                return Actions.getChatsList().then( () => Actions.openChat(chatId) );
            })
            .catch( error => apiErrorHandler(error) );
    }
    static createGroupChat ()
    {
        // TODO 
        return Promise.reject( createAppError('absent func', AppErrorCode.default, 'Actions.createGroupChat') );
    }
    static openChat (chatId : number) 
    {
        const id = String(chatId);
        const app = SurChat.instance;

        if (id != app.storeState.openedChat && id in app.storeState.chats)
        {
            return chatsApi.getUsers(chatId)
                .then(rawUsers =>
                {
                    const chatUsers : PlainObject< ChatUserFields > = {};

                    rawUsers.reduce((chatUsers, user) =>
                    {
                        chatUsers[String(user.id)] = user;
                        return chatUsers;
                    }, 
                    chatUsers);

                    if (!isEqual(chatUsers, app.storeState.chatUsers))
                    {
                        app.store.set('chatUsers', chatUsers, StoreSetStateType.replace);
                    }
                })
                .catch( error => apiErrorHandler(error) )
                .finally(() => 
                {                    
                    app.store.set('openedChat', id);
                });
        }
        return Promise.resolve();
    }
    static closeChat (chatId : number) 
    {
        const app = SurChat.instance;

        const id = String(chatId);
        if (id == app.storeState.openedChat)
        {
            app.store.set('openedChat', null);
            app.store.set('chatUsers', {}, StoreSetStateType.replace);
        }
        return Promise.resolve();
    }
    static deleteChat (chatId : number) 
    {
        return chatsApi.deleteChat(chatId)
            .then(() => Actions.getChatsList())
            .then(() => Actions.closeChat(chatId));
    } 
    static recieveLastMessage (chatId : number, msg : Message)
    {
        const app = SurChat.instance;
        const chat = app.storeState.chats?.[String(chatId)];

        if (chat)
        {
            chat.lastMessage = msg;
            chat.unreadCnt++;

            app.store.set(`chats.${chatId}`, chat);
        }
        return Promise.resolve();
    } 
    static toggleChatsLoader (flag : boolean) 
    {
        SurChat.instance.store.set('showChatsLoader', flag);
        return Promise.resolve();
    } 
    static toggleMessagesLoader (flag : boolean) 
    {
        SurChat.instance.store.set('showMessagesLoader', flag);
        return Promise.resolve();
    } 
    protected static _processProfileData (profile : ChatUserFields)
    {
        const app = SurChat.instance;
        const curProfile = app.storeState.currentUser;

        if (!curProfile || !isEqual(profile, curProfile))
        {
            app.store.set('currentUser', profile); 
        }
    } 
}
window.actions = Actions;

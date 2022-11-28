import {PlainObject} from "@core/types";
import {AppErrorCode, ChatFields, ChatUserFields, Message} from "@models/types";
import SurChat from "@app";
import {apiErrorHandler} from "@api/rest";
import chatsApi from "@api/chats";
import userApi from "@api/user";
import ChatUser from "@models/chat_user";
import Chat from "@models/chat";
import {isEqual} from "@lib-utils-kit";
import {createAppError} from "@app-utils-kit";

// TODO Обновляем пользователя (в кеше пользователей), когда открываем чат с ним
// TODO если user chat, то при этом обновляется авка чата и название выводимое
// TODO для юзер чатов если изменился пользователь, то меняется и инфа по чату (картинка, название)

export default class Actions 
{
    static defineUser ()
    {
        const app = SurChat.instance;

        return userApi.getProfile()                
            .then(profile => 
            {
                const curProfile = app.storeState.currentUser;

                if (!curProfile || !isEqual(profile, curProfile))
                {
                    app.store.set('currentUser', profile); 
                }
            })
            .catch(error => apiErrorHandler(error));
    }
    static logout ()
    {
        return userApi.logout()
            .then(() => SurChat.instance.store.set('currentUser', null))
            .catch(error =>
            {
                alert('Операция не выполнена');
                
                const {code, msg} = error.cause;                    
                console.error(code, `rest api: ${msg}`);                
            });
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
            .catch(error => 
            {
                const {code, msg} = error.cause;

                if (AppErrorCode.default == code)
                {
                    alert(msg);
                }
                else
                {
                    alert('Операция не выполнена');
                    apiErrorHandler(error);
                }                    
            });
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
                        app.store.set('chatUsers', chatUsers);
                    }
                })
                .catch(error => apiErrorHandler(error))
                .finally(() => 
                {                    
                    app.store.set('openedChat', id);
                });
        }
        return Promise.resolve();
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
                    app.store.set('chats', chats);
                }
            })
            .catch(error => apiErrorHandler(error));
    } 
    static recieveMessage (chatId : number, msg : Message)
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
}

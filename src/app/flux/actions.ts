import {PlainObject} from "@core/types";
import {AppErrorCode, AuthorizeData, ChangeAuthData, ChatFields, ChatUserFields, 
    Message, ProfileData, RegistrateData} from "@entities/types";
import SurChat from "@app";
import {StoreSetStateType} from "@core/store";
import {apiErrorHandler} from "@api/rest";
import chatsApi from "@api/chats";
import userApi from "@api/user";
import ChatUser from "@entities/chat_user";
import Chat from "@entities/chat";
import {isEqual} from "@lib-utils-kit";
import {createAppError} from "@app-utils-kit";

export default class Actions 
{
    static defineUser ()
    {
        console.log('Actions.defineUser fired');
        return userApi.getProfile()
            .then( profile => 
            {
                const app = SurChat.instance;
                const curProfile = app.storeState.currentUser;

                if (!curProfile || !isEqual( profile, curProfile ))
                {
                    console.log('Actions.defineUser store.set currentUser', profile);
                    app.store.set( 'currentUser', profile ); 
                }
            })
            .catch( error => apiErrorHandler( error ));
    }
    static createUser (data : RegistrateData)
    {
        console.log('Actions.createUser fired');
        return userApi.registrate( data )
            .then( () => Actions.defineUser() ) 
            .catch( error => apiErrorHandler( error ));
    }
    static authorizeUser (data : AuthorizeData)
    {
        console.log('Actions.authorizeUser fired');
        return userApi.authorize( data )
            .then( () => Actions.defineUser() )
            .catch( error => apiErrorHandler( error ));
    }
    static changeUserProfile (data : ProfileData)
    {
        console.log('Actions.changeUserProfile fired');
        return userApi.setProfile( data )
            .then( () => Actions.defineUser() )
            .catch( error => apiErrorHandler( error ));
    }
    static changeUserAuthData (data : ChangeAuthData)
    {
        console.log('Actions.changeUserAuthData fired');
        return userApi.changeAuthData( data )
            .then( () => Actions.defineUser() )
            .catch( error => apiErrorHandler( error ));
    }
    static logoutUser ()
    {
        console.log('Actions.logoutUser fired');
        return userApi.logout()
            .then( () => Actions.defineUser() )
            .catch( error => apiErrorHandler( error ));
    }       
    static getChatsList ()
    {   
        console.log('Actions.getChatsList fired');
        const app = SurChat.instance;

        return chatsApi.getChatsList()
            .then(rawChats =>
            {
                return (async () => 
                {
                    const chats : PlainObject< ChatFields > = {};

                    for (const chat of rawChats)
                    {
                        const curUserId = app.user.data?.id ?? 0;

                        // rest api don`t give us userId by login ( /user/search ) for current user. so fix it here
                        if (chat.lastMessage && !chat.lastMessage.userId)
                        {
                            chat.lastMessage.userId = curUserId;
                        }         
                        
                        // get collocutor data
                        if (Chat.isUserType(chat))
                        {
                            const collocutorId = chat.members.filter( user => user != curUserId )?.[0];

                            chat.collocutor = collocutorId 
                                ? await userApi.getProfileByID( collocutorId ).catch( error => apiErrorHandler( error ))
                                : null;
                        }
                        chats[chat.id] = chat;
                    }

                    if (!isEqual(chats, app.storeState.chats))
                    {
                        console.log('Actions.getChatsList store.set chats', chats, StoreSetStateType.replace);
                        app.store.set('chats', chats, StoreSetStateType.replace);
                    }
                })();
            })
            .catch( error => apiErrorHandler(error) );
    } 
    static createUserChat (login : string)
    {
        console.log('Actions.createUserChat fired');
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
            .then( chatId => Actions.getChatsList().then( () => chatId ) )
            .catch( error => apiErrorHandler(error) );
    }
    static createGroupChat (name : string)
    {
        // TODO 
        return Promise.reject( createAppError('absent func', AppErrorCode.default, 'Actions.createGroupChat') );
    }
    static openChat (chatId : number) 
    {
        console.log('Actions.openChat fired');
        const id = String(chatId);
        const app = SurChat.instance;

        return chatsApi.getUsers(chatId)
            .then(rawUsers =>
            {
                const chatUsers : PlainObject< ChatUserFields > = {};

                rawUsers.reduce((chatUsers, user) =>
                {
                    chatUsers[user.id] = user;
                    return chatUsers;
                }, 
                chatUsers);

                if (!isEqual(chatUsers, app.storeState.chatUsers))
                {
                    console.log('Actions.openChat store.set chatUsers', chatUsers, StoreSetStateType.replace);
                    app.store.set( 'chatUsers', chatUsers, StoreSetStateType.replace );
                }
            })
            .catch( error => apiErrorHandler(error) )
            .finally(() => 
            {                    
                console.log('Actions.openChat store.set openedChat', id);
                app.store.set( 'openedChat', id );
            });
    }
    static closeChat (chatId : number) 
    {
        console.log('Actions.closeChat fired');
        const app = SurChat.instance;

        const id = String(chatId);
        if (id == app.storeState.openedChat)
        {
            console.log('Actions.closeChat store.set openedChat', null);
            app.store.set( 'openedChat', null );
            //
            console.log('Actions.closeChat store.set chatUsers', {}, StoreSetStateType.replace);
            app.store.set( 'chatUsers', {}, StoreSetStateType.replace );
        }
        return Promise.resolve();
    }
    static deleteChat (chatId : number) 
    {
        console.log('Actions.deleteChat fired');
        return chatsApi.deleteChat( chatId )
            .then( () => Actions.getChatsList() )
            .catch( error => apiErrorHandler(error) );
    } 
    static recieveLastMessage (chatId : number, msg : Message)
    {
        console.log('Actions.recieveLastMessage fired');
        const app = SurChat.instance;

        const chat = app.storeState.chats?.[chatId];
        if (chat)
        {
            chat.lastMessage = msg;
            chat.unreadCnt++;

            console.log(`Actions.recieveLastMessage store.set chats.${chatId}`, chat, StoreSetStateType.merge, false);
            app.store.set( `chats.${chatId}`, chat, StoreSetStateType.merge, false );
        }
        return Promise.resolve();
    } 
    static toggleChatsLoader (flag : boolean) 
    {
        console.log('Actions.toggleChatsLoader store.set toggleChatsLoader', flag);

        SurChat.instance.store.set( 'showChatsLoader', flag );
        return Promise.resolve();
    } 
    static toggleMessagesLoader (flag : boolean) 
    {
        console.log('Actions.toggleMessagesLoader store.set toggleMessagesLoader', flag);
        
        SurChat.instance.store.set( 'showMessagesLoader', flag );
        return Promise.resolve();
    }
}

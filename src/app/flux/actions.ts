import {PlainObject} from "@core/types";
import {AppErrorCode, AuthorizeData, ChangeAuthData, ChatFields, ChatUserFields, 
    Message, ProfileData, RegistrateData} from "@entities/types";
import SurChat from "@app";
import {StoreSetStateType} from "@core/store";
import chatsApi from "@api/chats";
import userApi from "@api/user";
import ChatUser from "@entities/chat_user";
import Chat from "@entities/chat";
import {isEqual} from "@lib-utils-kit";
import {apiErrorHandler, createAppError} from "@app-utils-kit";

export default class Actions 
{
    static defineUser ()
    {
        return userApi.getProfile()
            .then( profile => 
            {
                const app = SurChat.instance;
                const curProfile = app.storeState.currentUser;

                if (!curProfile || !isEqual( profile, curProfile ))
                {
                    app.store.set( 'currentUser', profile ); 
                }
            })
            .catch( error => apiErrorHandler( error ));
    }
    static createUser (data : RegistrateData)
    {
        return userApi.registrate( data )
            .then( () => Actions.defineUser() ) 
            .catch( error => apiErrorHandler( error ));
    }
    static authorizeUser (data : AuthorizeData)
    {
        return userApi.authorize( data )
            .then( () => Actions.defineUser() )
            .catch( error => apiErrorHandler( error ));
    }
    static changeUserProfile (data : ProfileData)
    {
        return userApi.setProfile( data )
            .then( () => Actions.defineUser() )
            .catch( error => apiErrorHandler( error ));
    }
    static changeUserAuthData (data : ChangeAuthData)
    {
        return userApi.changeAuthData( data )
            .then( () => Actions.defineUser() )
            .catch( error => apiErrorHandler( error ));
    }
    static logoutUser ()
    {
        return userApi.logout()
            .then( () => Actions.defineUser() )
            .catch( error => apiErrorHandler( error ));
    }    

    static getChatsList ()
    {   
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
                        app.store.set('chats', chats, StoreSetStateType.replace);
                    }
                })();
            })
            .catch( error => apiErrorHandler( error ));
    } 
    static createUserChat (login : string)
    {
        const curUser = SurChat.instance.user.data;

        if (!curUser)
        {
            return Promise.reject( createAppError('no current user', AppErrorCode.default, 'Actions.createUserChat') );
        }
        return userApi.search( login )
            .then(users =>
            {
                if (users.length)
                {
                    const chatUser = new ChatUser(users[0]);

                    return chatsApi.addUserChat( chatUser.id, Chat.getUserChatName(curUser, chatUser) );
                }
                else
                    throw createAppError(`Пользователь с логином ${login} не найден`, AppErrorCode.userInput, 'createUserChat action');
            })
            .then( chatId => Actions.getChatsList().then( () => chatId ) )
            .catch( error => apiErrorHandler( error ));
    }
    static createGroupChat (name : string)
    {
        return chatsApi.addGroupChat( name )
            .then( chatId => Actions.getChatsList().then( () => chatId ) )
            .catch( error => apiErrorHandler( error ));
    }    
    static openChat (chatId : number) 
    {
        const id = String(chatId);
        const app = SurChat.instance;

        return Actions.getChatUsers(chatId)
            .finally(() => 
            {                    
                app.store.set( 'openedChat', id );
            });
    }
    static closeChat (chatId : number) 
    {
        const app = SurChat.instance;

        const id = String(chatId);
        if (id == app.storeState.openedChat)
        {
            app.store.set( 'openedChat', null );
            app.store.set( 'chatUsers', {}, StoreSetStateType.replace );
        }
        return Promise.resolve();
    }
    static deleteChat (chatId : number) 
    {
        return chatsApi.deleteChat( chatId )
            .then( () => Actions.getChatsList() )
            .catch( error => apiErrorHandler( error ));
    } 

    static getChatUsers (chatId : number)
    {
        const app = SurChat.instance;

        return chatsApi.getUsers( chatId )
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
                    app.store.set( 'chatUsers', chatUsers, StoreSetStateType.replace );
                }
            })
            .catch( error => apiErrorHandler( error ));
    }
    static addUser2chat (chatId : number, login : string)
    {
        return userApi.search( login )
            .then( users =>
            {
                if (users.length)
                {
                    return users[0].id;
                }
                else
                    throw createAppError(`Пользователь с логином ${login} не найден`, AppErrorCode.userInput, 'addUser2chat action');
            })
            .then( userId => chatsApi.addUser( chatId, userId ))
            .then( () => Actions.getChatUsers( chatId ))
            .catch( error => apiErrorHandler( error ));
    }
    static delUserFromChat (chatId : number, userId : number)
    {
        return chatsApi.delUser( chatId, userId )
            .then( () => Actions.getChatUsers( chatId ))
            .catch( error => apiErrorHandler( error ));
    }
    static recieveLastMessage (chatId : number, msg : Message)
    {
        const app = SurChat.instance;

        const chat = app.storeState.chats?.[chatId];
        if (chat)
        {
            chat.lastMessage = msg;
            chat.unreadCnt++;

            app.store.set( `chats.${chatId}`, chat, StoreSetStateType.merge, false );
        }
        return Promise.resolve();
    } 

    static toggleChatsLoader (flag : boolean) 
    {
        SurChat.instance.store.set( 'showChatsLoader', flag );
        return Promise.resolve();
    } 
    static toggleMessagesLoader (flag : boolean) 
    {
        SurChat.instance.store.set( 'showMessagesLoader', flag );
        return Promise.resolve();
    }
}

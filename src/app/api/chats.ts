import {ChatApi, ChatsListApi, ChatFields, Message} from "@models/types"; 
import {restChatsApi} from "@api/rest";
import {PlainObject} from "@core/types";
import userApi, {UserApi} from "@api/user";

class ChatsApi implements ChatsListApi, ChatApi
{    
    addUserChat (userId : number, name : string) 
    {
        return restChatsApi.post('', {title: name})
            .then(result =>
            {
                return restChatsApi.put('/users', {users: [userId], chatId: result.id}).then( result => result.id as number );
            });        
    }
    addGroupChat (name : string)
    {
        return restChatsApi.post('', {title: name}).then( result => result.id as number );
    }
    deleteChat (id : number)
    {
        return restChatsApi.delete('', {chatId: id}).then(() => {return});
    }
    getChatsList ()
    {
        return restChatsApi.get() 
            .then(chatsData => 
            {
                return (async () => 
                {
                    const chatsList : ChatFields[] = [];
                    
                    for (const chatsDataItem of chatsData as PlainObject[])
                    {
                        const {
                            unread_count: unreadCnt, 
                            created_by: createdBy, 
                            last_message: lastMsgData, 
                            ...chatData                        
                        } = chatsDataItem;

                        const chat = (<unknown>{
                            ...chatData, 
                            unreadCnt, 
                            createdBy, 
                            lastMessage: null, 
                            members: []
                        }) as ChatFields;

                        if (lastMsgData)
                        {
                            const {time, user: userData, ...msgData} = lastMsgData as PlainObject;

                            const user = UserApi.processUserData(userData as PlainObject);
                                               
                            chat.lastMessage = { 
                                ...msgData, 
                                datetime: new Date(time as string), 

                                // rest api don`t give us userId for last_message, so `ll get it
                                userId: await userApi.search( user.login ).then( users => users.length ? users[0].id : 0 )

                            } as Message;
                        }
                        // also `ll get chat`s members userIds to conform api interface 
                        chat.members = await this.getUsers( chat.id ).then( users => users.map(user => user.id) );

                        chatsList.push(chat);
                    }
                    return chatsList;
                })();
            }); 
    }
    getUsers (chatId : number)
    {
        return restChatsApi.get(`/${chatId}/users`) 
                    .then(userDataArr => 
                    {
                        return ( userDataArr as PlainObject[] ).map( userData => UserApi.processUserData(userData) );
                    }); 
    }
    getChatToken (id : number)
    {
        return restChatsApi.post(`/token/${id}`).then( result => result.token as string );
    }
    getNewMsgCnt (chatId : number)
    {
        return restChatsApi.get(`/new/${chatId}`).then( result => result.unread_count as number ); 
    }
}
const chatsApi = window.chatsApi = new ChatsApi();

export default chatsApi;

// getChatsList ()
//     {
//         const rawChatsList : PlainObject[] = [];
//         // const userLogins : Set< string > = new Set();

//         return restChatsApi.get() 
//             .then(chatsData => 
//             {
//                 console.log(chatsData);

//                 ( chatsData as PlainObject[] ).forEach(chatsItemData => 
//                 {
//                     const {
//                         unread_count: unreadCnt = 0, 
//                         created_by: createdBy, 
//                         last_message: lastMsgData, 
//                         ...chatData                        
//                     } 
//                     = chatsItemData;

//                     const {time, user: userData, ...msgData} = lastMsgData as PlainObject;
//                     const datetime = new Date(time as string);
//                     // const lastMsgUserLogin = (user as PlainObject).login as string;

//                     const user = UserApi.processUserData(userData as PlainObject);

//                     rawChatsList.push({// тут пока нет lastMessage c userId = 0, members  
//                         ...chatData, 
//                         unreadCnt, 
//                         createdBy, 
//                         lastMessage: { ...msgData, datetime, userId: 0 }, 
//                         lastMsgUser: user
//                     });

//                     for (let chatData of rawChatsList)
//                     {
//                         const {id: chatId, lastMsgUser} = chatData;
//                         const {login} = lastMsgUser as ChatUserFields;

                        // const userId : number = await userApi.search(login)
                        //                                 .then(users =>
                        //                                 {
                        //                                     return users.length ? users[0].id : 0;
                        //                                 });

                        // const members : number[] = await restChatsApi.get(`/${chatId}/users`) 
                        //                                     .then(userDataArr => 
                        //                                     {
                        //                                         const users : ChatUserFields[] = [];
                                                                
                        //                                         (userDataArr as PlainObject[]).forEach(userData => 
                        //                                         {
                        //                                             return UserApi.processUserData(userData);
                        //                                         });
                        //                                         return users;
                        //                                     }); 
                        
//                     }


                    

                    

//                     // userLogins.add(lastMsgUserLogin);

//                     // const lastMessage = Messenger.processMessage(lastMsgData); - тут не будет userID
//                 });

//                 //return 
//             }); 
//     }

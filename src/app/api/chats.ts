import {ChatUserProfile, ChatUserFields, CurrentUserFields} from "@models/types-app"; 
import {restAuthApi, restUsersApi, restChatsApi} from "@api/rest";

// работу с чатами (список чатов пользователя, создать новый чат, добавить пользователя в чат, удалить пользователя из чата).

// interface ChatListApi
// {
//     addChat () : void;
//     getList () : void;
//     deleteChat () : void;
// }
// interface ChatApi
// {
//     create () : void;
//     delete () : void;
// }
class ChatsApi 
{    
    static addUserChat (user : ChatUserFields) 
    {
        const chatName = user.nickname;
        const userID = user.id; 

        console.log(user);

        return restChatsApi.post('', {title: chatName})
            .then(result =>
            {
                if (result) // будет undefined  случае ошибки, которая не пробрасывается дальше 
                {
                    const {id} = result;
                    console.log(`new chat ${chatName} with id ${id} with user ${userID}`);

                    return restChatsApi.put('/users', {users: [userID], chatId: id})
                                .then(res => 
                                {
                                    console.log(res);
                                }); 
                }
            });

        // TODO никнейм нужно получать методом. вероятно тут интерфейс? 
        
    }
    static addGroupChat (name : string)
    {
        return restChatsApi.post('', {title: name})
            .then(res => 
            {
                console.log(res);
            }); 
    }
    static deleteChat (id : number)
    {
        return restChatsApi.delete('', {chatId: id})
            .then(res => 
            {
                console.log(res);
            }); 
            /* {
                "result": {
                  "id": 2552,
                  "title": "First chat",
                  "avatar": null,
                  "created_by": 116579
                },
                "userId": 116579
              } */
    }
    static getList ()
    {
        // TODO тут строкой параметров передавать какую часть 
        return restChatsApi.get() 
            .then(res => 
            {
                console.log(res);
            }); 
            /* массив

            avatar
            : 
            null
            created_by
            : 
            116579
            id
            : 
            2554
            last_message
            : 
            null
            title
            : 
            "Джабба Хатт"
            unread_count
            : 
            0 */
    }
    static getChatToken (chatId : number)
    {
        return restChatsApi.post(`/token/${chatId}`) 
            .then(res => 
            {
                console.log(res); // {token: }
            }); 
    }

    // TODO нужны еще методы для апи сообщений 
    // /chats/{chatId}/new
}
const chatsApi = window.chatsApi = new ChatsApi();

export default chatsApi;

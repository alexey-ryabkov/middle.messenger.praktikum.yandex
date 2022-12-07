import {PlainObject} from "@core/types";
import {ChatApi, ChatsListApi, ChatFields, Message} from "@entities/types"; 
import {restChatsApi} from "@api/rest";
import userApi, {UserApi} from "@api/user";

class ChatsApi implements ChatsListApi, ChatApi
{    
    addUserChat (userId : number, name : string) 
    {
        return restChatsApi.post('', {title: name})
            .then(result =>
            {
                const chatId = result.id as number;

                return restChatsApi.put('/users', {users: [userId], chatId}).then( () => chatId );
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
                return this._processChatsData(chatsData);
            }); 
    }
    getCommonChat (chatId : number)
    {
        return restChatsApi.get(`/${chatId}/common`) 
            .then(chatsData => 
            {
                return this._processChatsData(chatsData);
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
    getNewMsgCnt (chatId : number)
    {
        return restChatsApi.get(`/new/${chatId}`).then( result => result.unread_count as number ); 
    }
    // TODO divide this method (too many request is price for universality), mb refuse to use interfaces implementing (ChatsListApi, ChatApi, etc)
    protected _processChatsData (chatsData : PlainObject[])
    {
        return (async () => 
        {
            const chatsList : ChatFields[] = [];
            
            for (const chatsDataItem of chatsData)
            {
                const {
                    unread_count: unreadCnt, 
                    created_by: createdBy, 
                    last_message: lastMsgData, 
                    ...chatData                        
                } = chatsDataItem;

                const chat = <unknown>{
                    ...chatData, 
                    unreadCnt, 
                    createdBy, 
                    lastMessage: null, 
                    members: [],
                    token: ''
                } as ChatFields;

                if (lastMsgData)
                {
                    const {time, user: userData, ...msgData} = lastMsgData as PlainObject;

                    const user = UserApi.processUserData(userData as PlainObject);
                                        
                    chat.lastMessage = { 
                        ...msgData, 
                        datetime: new Date(time as string), 

                        // rest api don`t give us userId for last_message, so get it
                        userId: await userApi.search( user.login ).then( users => users.length ? users[0].id : 0 )

                    } as Message;
                }

                // also get chat`s members userIds and token to conform api interface                 
                chat.members = await this.getUsers( chat.id ).then( users => users.map(user => user.id) );
                chat.token = await this._getChatToken( chat.id );

                chatsList.push(chat);
            }
            return chatsList;
        })();
    }
    protected _getChatToken (id : number)
    {
        return restChatsApi.post(`/token/${id}`).then( result => result.token as string );
    }
}
const chatsApi = new ChatsApi();

export default chatsApi;

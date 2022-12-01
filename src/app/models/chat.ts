import SurChat from '@app';
import {ChatFields, ChatMessage, Message, MessageType} from '@models/types';
import {apiErrorHandler} from '@api/rest';
import chatsApi from '@api/chats';
import Messenger, {MessengerEvents} from '@api/messages';
import CurrentUser from '@models/current_user';
import ChatUser from '@models/chat_user';
import Actions from '@flux/actions';

export enum ChatType
{
    user = 'user',
    group = 'group',
}
export default class Chat
{
    unreadCnt : number;

    protected _id : number;
    protected _createdBy : number;
    protected _avatar : string | null;
    protected _token : string;
    protected _title : string;
    protected _members: number[];
    protected _messenger : Messenger;
    protected _userId : number;
    protected _type : ChatType;

    constructor (
        protected _app : SurChat, 
        fields : ChatFields)
    {
        ({
            id: this._id,
            createdBy: this._createdBy = 0,
            avatar: this._avatar = null,    
            token: this._token = '',        
            title: this._title = '',
            unreadCnt: this.unreadCnt = 0,
            members: this._members = [],             
        } = fields);

        this._userId = this._app.user.data?.id ?? 0;

        (this._messenger = new Messenger( this._userId, this._id, this._token ))
                .on(MessengerEvents.message, message => 
                {
                    Actions.recieveLastMessage(this._id, message as Message);
                })
                .on(MessengerEvents.error, error => console.error(error));

        this._processChatType();
    }
    get id ()
    {
        return this._id;
    }
    get title ()
    {
        if (ChatType.user == this._type)
        {
            const collocutor = this.collocutor;

            if (collocutor)
            {
                return collocutor.nickname;
            }
        }
        return this._title;        
    }
    get avatar ()
    {
        if (ChatType.user == this._type)
        {
            const collocutor = this.collocutor;

            if (collocutor)
            {
                return collocutor.avatar;
            }
        }
        return this._avatar;        
    }
    get createdBy ()
    {
        return this._app.storeState.chatUsers?.[ this._createdBy ] ?? null;        
    }
    get members ()
    {
        return this._members
            .map( userId => (this._app.storeState.chatUsers?.[ String(userId) ] ?? null) )
            .filter(userFields => !!userFields)
            .map( userFields => new ChatUser(userFields) );
    }  
    get collocutor ()
    {
        const collocutorId = this._members.filter( user => user != this._userId )?.[0];

        if (collocutorId)
        {
            const collocutor = this._app.storeState.chatUsers?.[ String(collocutorId) ];

            return collocutor ? new ChatUser( collocutor ) : null;
        }
        return null;
    }  
    get messages ()
    {
        return chatsApi.getNewMsgCnt(this._id)
            .then(unreadCnt => 
            {
                return (async () =>
                {
                    let messages : ChatMessage[] = [];                    
                    do
                    {
                        messages = messages.concat( await this._messenger.getHistory() );
                    } 
                    while (messages.length < unreadCnt);

                    return messages;
                })();
            })
            .catch(error => apiErrorHandler(error));
    }
    get lastMessage ()
    {
        return this._app.storeState.chats?.[ String(this._id) ].lastMessage;
    }
    sendMessage (content : string, type : MessageType = 'message')
    {
        return this._messenger.send(content, type);
    }
    onDelete ()
    {
        this._messenger.close();
    }
    protected _isUserChat ()
    {
        return ChatType.user == this._type;
    }
    protected _processChatType ()
    {
        // TODO define by ' vs ' substr in title and 2 == this._members.length 
        this._type = ChatType.user;
    }
    static getUserChatName(user : ChatUser, collocutor : ChatUser)
    {
        return `${user?.nickname} vs ${collocutor.nickname}`;
    }
}

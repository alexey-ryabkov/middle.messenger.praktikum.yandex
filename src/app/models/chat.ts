import SurChat from '@app';
import Actions from '@flux/actions';
import {ChatFields, ChatMessage, Message, MessageType} from '@models/types';
import {apiErrorHandler} from '@api/rest';
import resourcesApi from '@api/resources';
import chatsApi from '@api/chats';
import Messenger, {MessengerEvents} from '@api/messenger';
import ChatUser from '@models/chat_user';

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
    protected _members : number[];
    protected _messenger : Messenger;
    protected _userId : number;
    protected _type : ChatType;
    protected _messagesHistory : ChatMessage[];
    protected _collocutor : ChatUser | null = null;
    
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
                .on( MessengerEvents.message, message => 
                {
                    Actions.recieveLastMessage(this._id, message as Message);
                })
                .on( MessengerEvents.error, error => console.error(error) );

        this._type = Chat.isUserType( fields ) ? ChatType.user : ChatType.group;

        const {collocutor} = fields;
        if (collocutor && this._isUserChat)
        {
            this._collocutor = new ChatUser(collocutor);
        }
    }
    get id ()
    {
        return this._id;
    }
    get title ()
    {
        if (this._isUserChat)
        {
            return this.collocutor?.nickname || this._title;
        }
        return this._title;        
    }
    get avatar ()
    {
        let avatar : string | null = null;

        if (this._isUserChat)
        {
            avatar = this.collocutor?.avatar || null;
        }
        if (!avatar && this._avatar)
        {
            avatar = resourcesApi.get(this._avatar); 
        }
        return avatar;        
    }
    get createdBy ()
    {
        return this._app.storeState.chatUsers?.[ this._createdBy ] ?? null;        
    }
    get members ()
    {
        return this._members
            .map( userId => (this._app.storeState.chatUsers?.[userId] ?? null) )
            .filter(userFields => !!userFields)
            .map( userFields => new ChatUser(userFields) );
    }  
    get collocutor ()
    {
        return this._collocutor;
    }
    get lastMessage ()
    {
        return this._app.storeState.chats?.[this._id].lastMessage;
    }
    get messages ()
    {
        return this._messagesHistory;
    }
    protected get _isUserChat ()
    {
        return ChatType.user == this._type;
    }
    init ()
    {
        return this._messenger.init();
    }
    loadMessages ()
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
            .then(messages => 
            {
                this._messagesHistory = messages;
            })
            .catch( error => apiErrorHandler(error) );
    }    
    sendMessage (content : string, type : MessageType = 'message')
    {
        return this._messenger.send(content, type);
    }
    onDelete ()
    {
        this._messenger.close();
    }    
    static isUserType (chatFields : ChatFields)
    {
        // TODO also check ' vs ' substr in title
        return 2 == chatFields.members.length;
    }
    static getUserChatName(user : ChatUser, collocutor : ChatUser)
    {
        return `${user?.nickname} vs ${collocutor.nickname}`;
    }
}

import {Field, PlainObject} from "@core/types";
import EventBus from "@core/event_bus";

export type AppStoreScheme = 
{    
    currentUser : ChatUserFields | null,
    chats : PlainObject< ChatFields >, 
    openedChat : string | null,
    chatUsers : PlainObject< ChatUserFields >,
    showChatsLoader : boolean,
    showMessagesLoader : boolean,
    openedPage : string | null,
};

export type ChatUserProfile =
{
    login : string,
    avatar : string | null,
    nickname : string,
    first_name : string,
    second_name : string,    
    email : string,
    phone : string,
}
export type ChatUserFields = ChatUserProfile &
{
    id : number
};
export type CurrentUserFields = ChatUserFields &
{    
    password : string,    
};
export type UserField = Field &
{
    name : keyof Omit< CurrentUserFields, 'id' >,
}; 
export type RegistrateData = Omit< CurrentUserFields, 'avatar' | 'nickname' | 'id' >;
export type AuthorizeData = { login: string, password: string };
export type ChangeAuthData = { 
    login: string, 
    oldPassword: string, 
    newPassword: string
};
export type ProfileData = Omit< ChatUserProfile, 'login' | 'avatar' > & {
    avatar : FormData | null
};

export interface AuthUserApi
{
    registrate (data : RegistrateData) : Promise< number >;
    authorize (data : AuthorizeData) : Promise< void >;
    changeAuthData (data : ChangeAuthData) : Promise< void >;
    logout () : Promise< void >;
}
export interface ChatUserApi
{
    search (login : string) : Promise< ChatUserFields[] >;
    getProfileByID (userID : number) : Promise< ChatUserFields >;
}
export interface UserProfileApi
{
    setProfile (data : ProfileData) : Promise< void >;
    getProfile () : Promise< ChatUserFields >;
}

export type MessageFile = {
    id : number,
    user_id : number,
    path : string,
    filename : string,
    content_type : string,
    content_size : number,
    upload_date : string,
};
export type MessageType = 'message' | 'file' | 'sticker';
export type Message = 
{
    id : number,
    userId : number,
    datetime : Date,
    type?: MessageType,
    content : string,   
    file? : MessageFile | null,      
}; 
export type ChatMessage = Message &
{
    chatId : number,
    isRead: boolean,
};
export interface MessengerApi extends EventBus
{
    send (content : string, type : MessageType) : Promise< void >;
    getHistory (offset : number) : Promise< ChatMessage[] >;
}

export type ChatFields = 
{
    id : number,
    createdBy : number,
    avatar : string | null,
    title : string,
    unreadCnt : number,
    lastMessage : Message | null,
    members : number[],
    token : string,
}
export interface ChatsListApi
{
    addUserChat (userId : number, name : string) : Promise< number >;
    addGroupChat (name : string) : Promise< number >;
    deleteChat (id : number) :  Promise< void >;
    getChatsList () : Promise< ChatFields[] >;
}
export interface ChatApi
{
    getUsers (chatId : number) : Promise< ChatUserFields[] >;
    getNewMsgCnt (chatId : number) : Promise< number >;
}

export interface FileApi
{
    get (file : string) : string;
    upload (file : FormData) : Promise< void >;
}

export enum AppErrorCode
{
    unknown = 0,

    restApiRequest = 400,
    restApiAuth,
    restApiAccess = 403,
    restApiPath,
    restApiServer = 500,

    wsApi = 600,

    default = 700, 
    dev,   
    userInput,
}
export type AppError = Error &
{
    cause: {
        code : AppErrorCode, 
        msg : string,
        additional?: string
    }
}

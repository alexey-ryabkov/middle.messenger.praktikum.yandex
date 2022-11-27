import EventBus from "@core/event_bus";
import { Field, PlainObject } from "@core/types";

export type AppStoreScheme = 
{    
    currentUser: ChatUserFields | null,
    chats: PlainObject< ChatFields >, 
    openedChat: number | null
    chatUsers: PlainObject< ChatUserFields >,
};

// ----------- user

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
export type ChangeAuthData = { login: string, oldPassword: string, newPassword: string };
export type ProfileData = Omit< ChatUserProfile, 'login' >;

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

// ----------- messages

/* {
    image : string,
    name : string,
    isOpened : boolean,
    datetime? : string,
    msg? : string,
    author : 'you' | null,
    tag? : string,
    newMsgCnt? : number
}; */

/* {
    msg : string,
    datetime : string,    
    of : 'you' | 'chat',
    type? : MessageTypes,
}; */

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

export enum MessengerEvents {
    opened = 'opened',
    userConnected = 'userConnected',
    message = 'message',
    history = 'history',
    // msgError = 'msgError',
    closed = 'closed',
    error = 'error',
}

// ----------- chat

export type ChatFields = 
{
    id : number,
    createdBy : number,
    avatar : string | null,
    title : string,
    unreadCnt : number,
    lastMessage : Message | null,
    members: number[],
}
export interface ChatsListApi
{
    addUserChat (userId : number, name : string) : Promise< number >;
    addGroupChat (name : string) : Promise< number >;
    deleteChat (id : number) :  Promise< void >; // Pick< ChatFields, 'id' | 'userId' >
    getChatsList () : Promise< ChatFields[] >;
}
export interface ChatApi
{
    getUsers (chatId : number) : Promise< ChatUserFields[] >;
    getChatToken (chatId : number) : Promise< string >;
    getNewMsgCnt (chatId : number) : Promise< number >;
}

/* 
для юзер чатов если изменился пользователь, то меняется и инфа по чату (картинка, название)

*/



// MsgWsApi





/* 

@todo надо связать это с уже написанными валидаторами
только теперь значение берется не из поля
а из объекта

type ProfileFields
{
    first_name : string,
    phone : string,
    ...
}
этот тип в интерфейс UserApi

type FieldDef
{
    name : string, in ProfileFields
    label : string,
    validators : () => boolean,
    value : string
} 
отличается от FormField который интерфейс для блоков полей формы 
является для него родителем 

ниже прописать статикой (или в json вынести)
UserFields

это использовать на page-ах 
user.getField('login').validators

для возврата profile
getFields(['nickname', ...])
а модуль сам сможет взять 
nickname, avatar

только берет он из стора 

оптимизировать не только обновление пропсов но и запросы к апи чтоб не шли при каждой отрисовке 

*/

// Pick< ProfileFields, 'login' | 'password' >

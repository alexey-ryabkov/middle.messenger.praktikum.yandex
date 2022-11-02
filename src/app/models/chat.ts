

// TODO пльзователь ведь тоже мб чатом 

import {Image, Video, Location, Label} from '@models/types';


type ChatMember = // TODO это замешано с валидаторами обязательных полей регистрации 
{
    nickname:string,
    first_name?:string,
    last_name?:string,    
    avatar?:Image,
    email?:string,
    phone?:string,
}

enum MessageType 
{
    text,
    photo,
    video,
    location
}
type MessageContent = Image | Video | Location | string;

// Record<K:MessageType, V:MessageContent>

type Message = // TODO если такие проверки, то это скорее класс... 
{
    user:ChatMember,
    type:MessageType,
    content:MessageContent,
    time:Date
}

// интерфейс labeled

export default class Chat 
{
    members:ChatMember[];

    get label ():Label // нужно другое слово... типа значем. логотип, эмблема logoInfo 
    {
        const {nickname:title, avatar:image} = this.members[0];
        return {title, image};
    }
    get lastMessage ():Message|null 
    {
        return null;
    }
    get isGroup () 
    {
        return false
    }
}

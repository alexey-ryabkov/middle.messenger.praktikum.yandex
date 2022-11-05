import chatProfile from '@data/buddy.json'; 
import chatMessages from '@data/messages.json'; 

export default class Chat 
{
    get profile ()
    {
        return chatProfile;
    }
    get messages ()
    {
        return chatMessages;
    }
}

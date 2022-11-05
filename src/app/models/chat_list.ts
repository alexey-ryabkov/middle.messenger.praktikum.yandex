import Chat from "@models/chat";
import chats from '@data/chats.json'; 

export default class ChatList 
{
    get list ()
    {
        return chats;
    }
    get activeChat ()
    {
        return new Chat();
    }
}

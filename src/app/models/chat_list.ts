import Chat from "@models/chat";
import chats from '@data/chats.json'; 

export default class ChatList 
{
    get list ()
    {
        // parcel can ref to image, only if it static string
        // so we can`t do it dynamically (get image from json)  
        if (chats['chat1'])
        {
            const chat1imageUrl = new URL(
                '../../../static/images/hatt.jpg',
                import.meta.url
            );
            chats['chat1'].image = chat1imageUrl.pathname;
        }
        if (chats['chat2'])
        {
            const chat2imageUrl = new URL(
                '../../../static/images/grimes.jpg',
                import.meta.url
            );
            chats['chat2'].image = chat2imageUrl.pathname;
        }
        if (chats['chat3'])
        {
            const chat3imageUrl = new URL(
                '../../../static/images/michael.jpg',
                import.meta.url
            );
            chats['chat3'].image = chat3imageUrl.pathname;
        }
        return chats;
    }
    get activeChat ()
    {
        return new Chat();
    }
}

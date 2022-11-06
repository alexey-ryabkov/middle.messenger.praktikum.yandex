import Chat from "@models/chat";
import chats from '@data/chats.json'; 

export default class ChatList 
{
    get list ()
    {
        // parcel can ref to image, only if it static string
        // so we can`t do it dynamically (get image from json)  
        const chat1imageUrl = new URL(
            '../../../static/images/hatt.jpg',
            import.meta.url
        );
        chats['chat1'].image = chat1imageUrl.pathname;

        const chat2imageUrl = new URL(
            '../../../static/images/grimes.jpg',
            import.meta.url
        );
        chats['chat2'].image = chat2imageUrl.pathname;

        const chat3imageUrl = new URL(
            '../../../static/images/michael.jpg',
            import.meta.url
        );
        chats['chat3'].image = chat3imageUrl.pathname;
        
        return chats;
    }
    get activeChat ()
    {
        return new Chat();
    }
}

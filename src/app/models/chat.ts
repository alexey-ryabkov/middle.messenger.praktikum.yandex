import chatProfile from '@data/buddy.json'; 
import chatMessages from '@data/messages.json'; 

export default class Chat 
{
    get profile ()
    {
        // parcel can ref to image, only if it static string
        // so we can`t do it dynamically (get image from json)  
        const imageUrl = new URL(
            '../../../static/images/hatt.jpg',
            import.meta.url
        );
        chatProfile.image = imageUrl.pathname;
        
        return chatProfile;
    }
    get messages ()
    {
        return chatMessages;
    }
}

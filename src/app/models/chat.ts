import MessagesApi, {MsgApi, MsgApiEvents} from '@api/messages';
import User from '@models/user';
import chatProfile from '@data/buddy.json'; 
import chatMessages from '@data/messages.json'; 

// импортируем chatsApi

export default class Chat 
{
    // protected _msgApi : MsgApi | null = null;
    // constructor (chatId : number, user : User)
    // {
    //     chatsApi.getChatToken(chatId)
    //                 .then(token => 
    //                 {
    //                     this._msgApi = new MessagesApi(user.id, chatId, token);

    //                     this._msgApi.on(MsgApiEvents.error, error => console.error(error));

    //                     // this._msgApi.on(MsgApiEvents.message, () => {});
    //                     // this._msgApi.on(MsgApiEvents.hist, () => {});
    //                 });
    // }
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
    onClose ()
    {
        // TODO когда закрываем чат закроем сокет 
    }
}

import SurChat from '@app';
import {UserField} from '@models/types';
import ChatUser from '@models/chat_user';
import userProfile from '@data/user.json'; 

export default class CurrentUser
{
    protected _fields : UserField[];

    constructor (
        protected _app : SurChat
    ) {        
    }
    get fields ()
    {
        // TODO work with CurrentUserFields, field getter with desc for form pages (see in *-api branch)
        return this._fields;
    }
    get data ()
    {
        const user = this._app.storeState.currentUser;
        return user ? new ChatUser(user) : null;
    }
    get isAuthorized ()
    {
        return null !== this.data;
    }
    static getField (name : string)
    {
        // TODO
    }
    static getFieldValidators (name : string)
    {
        // TODO
    }
    // TODO below depricated 
    get dummyProfile ()
    {  
        const profile : Record< string, string > = userProfile;

        // parcel can ref to image, only if it static string
        // so we can`t do it dynamically (get image from json) 
        const imageUrl = new URL(
            '../../../static/images/cat.jpg',
            import.meta.url
        );
        profile.image = imageUrl.pathname;
        profile.name = userProfile.nickname;
        
        return profile;
    }
}

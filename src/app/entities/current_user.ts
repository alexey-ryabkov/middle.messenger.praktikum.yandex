import SurChat from '@app';
import {UserField} from '@entities/types';
import ChatUser from '@entities/chat_user';

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
    // TODO static getField (name : string)
    // TODO static getFieldValidators (name : string)
}

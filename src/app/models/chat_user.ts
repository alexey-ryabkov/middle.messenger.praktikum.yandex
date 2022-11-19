import {ChatUserFields} from "@models/types-app";

export default class ChatUser implements ChatUserFields
{
    avatar : string;    
    first_name : string;
    second_name : string;    
    email : string;
    phone : string;

    protected _id : number;
    protected _login : string;
    protected _nickname : string;

    constructor (fields : ChatUserFields)
    {
        ({
            id : this._id,
            login : this._login,
            avatar : this.avatar = '',            
            first_name : this.first_name = '',
            second_name : this.second_name = '',
            email : this.email = '',
            phone : this.phone = '',
            nickname : this._nickname = '',
        } = fields);
    }
    get id ()
    {
        return this._id;
    }
    get login ()
    {
        return this._login;
    }
    get nickname ()
    {
        const fullname = `${this.first_name} ${this.second_name}`.trim();

        return !this._nickname 
                        ? !fullname
                            ? this.login
                            : fullname
                        : this._nickname;
    }
}

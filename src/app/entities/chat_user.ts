import resourcesApi from "@api/resources";
import {ChatUserFields} from "@entities/types";

export default class ChatUser implements ChatUserFields
{
    first_name : string;
    second_name : string;    
    email : string;
    phone : string;

    protected _id : number;
    protected _login : string;
    protected _nickname : string;
    protected _avatar : string | null;    

    constructor (fields : ChatUserFields)
    {
        ({
            id : this._id,
            login : this._login,
            avatar : this._avatar = null,            
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
    get avatar ()
    {
        return this._avatar ? resourcesApi.get(this._avatar) : null;
    }
}

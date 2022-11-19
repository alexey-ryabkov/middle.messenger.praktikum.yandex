import userProfile from '@data/user.json'; 
// import { FieldValidator } from '@lib-utils/form_validation';
import {Stateful} from '@models/store';

let profile : Record< string, string > = userProfile;

// parcel can ref to image, only if it static string
// so we can`t do it dynamically (get image from json) 
const imageUrl = new URL(
    '../../../static/images/cat.jpg',
    import.meta.url
);
profile.image = imageUrl.pathname;
profile.name = userProfile.nickname;


export default class User 
{
    constructor (
        protected _store : Stateful
    ) {}
    get profile ()
    {   
        // userApi.getInfo()
        //     .then(data => this._store.set('user', data));
        // тут получится кольцевая ссылка, т.к. апп вызывает у себя этот класс, а тут мы испльзуем стор из апа...
        // нужно получать стор или апп в конструкторе 
        // тогда и сто должен соблюдать интерфейс какой-нить...

        // здесь мы должны давать инфу с каким путем стора мы работем 
        
        return profile;
    }
}

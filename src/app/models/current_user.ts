import SurChat from '@app';
import userProfile from '@data/user.json'; 
// import { FieldValidator } from '@lib-utils/form_validation';
import ChatUser from '@models/chat_user';
import {ChatUserFields, UserField} from '@models/types';
import {isEmptyValidator, lengthValidator, loginValidator} from '@lib-utils/form_validation';

// const app = SurChat.instance;

// export const userFields : UserField[] = [
//     {
//         name: 'nickname',
//         label: 'Никнейм'
//     }
// ];

// TODO для регистрации и авторизации эти поля также буду нужны, а их не будет без ChatUserFields 

// const userFieldParams = 
// {
//     login:
//     {
//         label: 'Логин',
//         validators: [
//             [ isEmptyValidator ],
//             [ loginValidator ],
//             [ lengthValidator, [3, 20] ],     
//         ],
//     }, 
//     nickname: 'Никнейм',
//     first_name: 'Имя'
// };

export default class CurrentUser
{
    protected _fields : UserField[];

    constructor (
        protected _app : SurChat
    ) {
        // TODO  брать из константы 
        // TODO  ипо валидатором отдельный объект 
        // Object.entries( 
        // {
        //     login: 'Логин',
        //     nickname: 'Никнейм',
        //     first_name: 'Имя'

        // }).forEach(([name, label]) =>
        // {
        //     this._fields.push({ 
        //         name, 
        //         label, 
        //         value: this[name], // для поля пароль не будет, его отдельно 
        //     });
        // });
    }
    // get fields ()
    // {
    //     return this._fields;
    // }
    // // TODO string in ... 
    // getField (name : string)
    // {
    //     return this._fields[name];
    // }
    get data ()
    {
        const user = this._app.storeState.currentUser;
        return user ? new ChatUser(user) : null;
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
// formFields: [                
//     [
//         new InputImage({
//             name: 'avatar',
//             label: 'Аватар',
//             image: userProfile.image
//         })
//     ], [
//         new InputText({
//             name: 'nickname',
//             label: 'Никнейм',   
//             value: userProfile.nickname                 
//         }),
//         [
//             [ InputText.validationEvents, isEmptyValidator ],
//         ]
//     ], [
//         new InputText({
//             name: 'phone',
//             label: 'Телефон',   
//             value: userProfile.phone                 
//         }),
//         [
//             [ InputText.validationEvents, isEmptyValidator ],
//             [ InputText.validationEvents, phoneValidator ],
//             [ InputText.validationEvents, lengthValidator, [10, 15] ],
//         ]
//     ], [
//         new InputText({
//             name: 'email',
//             label: 'Почта',   
//             value: userProfile.email                 
//         }),
//         [
//             [ InputText.validationEvents, isEmptyValidator ],
//             [ InputText.validationEvents, emailValidator ],
//         ]
//     ], [
//         new InputText({
//             name: 'first_name',
//             label: 'Имя',   
//             value: userProfile.first_name                 
//         }),
//         [
//             [ InputText.validationEvents, isEmptyValidator ],
//             [ InputText.validationEvents, nameValidator ],
//         ]
//     ], [
//         new InputText({
//             name: 'last_name',
//             label: 'Фамилия',   
//             value: userProfile.last_name                 
//         }),
//         [
//             [ InputText.validationEvents, isEmptyValidator ],
//             [ InputText.validationEvents, nameValidator ],
//         ]
//     ]],
/* 

@todo надо связать это с уже написанными валидаторами
только теперь значение берется не из поля
а из объекта

type ProfileFields
{
    first_name : string,
    phone : string,
    ...
}
этот тип в интерфейс UserApi

type FieldDef
{
    name : string, in ProfileFields
    label : string,
    validators : () => boolean,
    value : string
} 
отличается от FormField который интерфейс для блоков полей формы 
является для него родителем 

ниже прописать статикой (или в json вынести)
UserFields

это использовать на page-ах 
user.getField('login').validators

для возврата profile
getFields(['nickname', ...])
а модуль сам сможет взять 
nickname, avatar

только берет он из стора 

оптимизировать не только обновление пропсов но и запросы к апи чтоб не шли при каждой отрисовке 

*/

// Pick< ProfileFields, 'login' | 'password' >

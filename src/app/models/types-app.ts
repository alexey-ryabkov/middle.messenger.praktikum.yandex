import { Field } from "@models/types";

export type ChatUserProfile =
{
    login : string,
    avatar : string,
    nickname : string,
    first_name : string,
    second_name : string,    
    email : string,
    phone : string,
}
export type ChatUserFields = ChatUserProfile &
{
    id : number
};
export type CurrentUserFields = ChatUserFields &
{    
    password : string,    
};
export type UserField = Field &
{
    name : keyof Exclude< CurrentUserFields, 'id' >,
}; 
export const userFields : UserField[] = [
    {
        name: 'nickname',
        label: 'Никнейм'
    }
];


// export interface UserApi
// {
//     registrate (data : Exclude< ProfileFields, 'avatar' >) : number | null;
//     setProfile (data : ProfileFields) : void; // только тут без пароля и логина. получается тип нужно назвать InfoFields

//     authorize (data : Pick< AllFields, 'login' | 'password' >) : void; // login : string, password : string
//     changeAuthData () : void;
//     logout () : void;

//     getInfo () : AllFields;   
//     // // или сделать 2 типа с наследованием один от другого
//     search (phrase : string) : void;

//     // TODO а что насчет прочих пользователей 
// }
/*

AuthUserApi
-regisrate
-authorize
-changeAuthData
-logout
ChatUserApi
-search
-getInfo
UserInfoApi
-setProfile
-getProfile

*/


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

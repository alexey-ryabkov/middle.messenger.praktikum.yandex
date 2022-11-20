// import Http from "@models/http";
// TODO для типов дублируется название файлов и поэтому для них нужны отдельные пути или по другому их нужно называть
import {ChatUserProfile, ChatUserFields, CurrentUserFields} from "@models/types"; 
import {restAuthApi, restUsersApi} from "@api/rest";
// import {AllFields, ProfileFields, UserApi} from "@models/user";

// const userID = 116579;

/*
ChatUserProfile 
*/

type RegistrateData = Exclude< CurrentUserFields, 'avatar' & 'nickname' & 'id'  >;
type AuthorizeData = { login: string, password: string };
type ChangeAuthData = { login: string, oldPassword: string, newPassword: string };
type ProfileData = Exclude< ChatUserProfile, 'login' >;

// TODO там где unknown вернуть ожидаемые структуры 
interface AuthUserApi
{
    registrate (data : RegistrateData) : Promise< {id : number} | void >;
    authorize (data : AuthorizeData) : Promise< unknown >;
    changeAuthData (data : ChangeAuthData) : Promise< unknown >;
    logout () : Promise< void >;
}
interface ChatUserApi
{
    search (login : string) : Promise< unknown >;
    getProfileByID (userID : number) : Promise< unknown >;
}
interface UserProfileApi
{
    setProfile (data : ProfileData)  : Promise< unknown >;
    getProfile () : Promise< unknown >;
}

// TODO после отладки убрать статические методы и вернуть экспортом объект. 
class UserApi implements AuthUserApi, ChatUserApi, UserProfileApi
{
    // registrate = (data : RegistrateData) => UserApi.registrate(data);
    // authorize = (data : AuthorizeData) => UserApi.authorize(data);
    // changeAuthData = (data : ChangeAuthData) => UserApi.changeAuthData(data);
    // logout = () => UserApi.logout();

    registrate (data : RegistrateData) 
    {
        return restAuthApi.post('/signup', data)
                    .then(result =>
                    {
                        if (result) // будет undefined  случае ошибки, которая не пробрасывается дальше 
                        {
                            const {id} = result;
                            console.log(`new user id ${id}`);
                        }
                    });
    }
    authorize (data : AuthorizeData)
    {    
        return restAuthApi.post('/signin', data);
    }
    changeAuthData (data : ChangeAuthData)
    {
        const {login, ...passwordData} = data;

        // TODO запрос с логином, только если он поменялся 
        return restAuthApi.get('/user')
                    .then(profile =>
                    {
                        if (profile)
                        {
                            const profileData = {...profile, login};

                            console.log(profileData, passwordData);

                            return Promise.all([
                                    restUsersApi.put('/profile', profileData),
                                    restUsersApi.put('/password', passwordData)
                                ]);
                        }
                    });
    }
    logout () 
    {
        return restAuthApi.post('/logout');
    }

    // search = (login : string) => UserApi.search(login);
    // getProfileByID = (userID : number) => UserApi.getProfileByID(userID);

    search (login : string) 
    {
        // TODO возвращает массив ChatUserFields 
        return restUsersApi.post('/search', {login})
                    .then(res => 
                    {
                        console.log(res);
                    }); 
    }
    getProfileByID (userID : number) 
    {
        return restUsersApi.get(`/${userID}`)
                    .then(res => 
                    {
                        // тут профиль с id 
                        console.log(res);
                    }); // , {type: 'json'}
    }

    // setProfile = (data : ProfileData) => UserApi.setProfile(data);
    // getProfile = () => UserApi.getProfile();

    setProfile (data : ProfileData) 
    {
        return restAuthApi.get('/user')
                    .then(profile =>
                    {
                        if (profile)
                        {
                            const {avatar, nickname, ...userData} = data;
                            const profileData = {...profile, ...userData, display_name: nickname};

                            console.log(profileData, avatar);

                            return restUsersApi.put('/profile', profileData);

                            // return Promise.all([
                            //     restUsersApi.put('/profile', profileData),
                            //     restUsersApi.put('/profile/avatar', avatar)
                            //     // , dataType: 'formdata'
                            // ]);
                        }
                    });
    }
    getProfile ()
    {
        return restAuthApi.get('/user')
                    .then(res => 
                    {
                        // тут профиль с id
                        // меняю display_name. в get info выше - также
                        console.log(res);
                    }); 
    }
}
const userApi = window.userApi = new UserApi();

export default userApi;

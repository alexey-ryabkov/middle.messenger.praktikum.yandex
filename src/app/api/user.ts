import { PlainObject } from "@core/types";
import {AuthUserApi, ChatUserApi, UserProfileApi, 
    RegistrateData, AuthorizeData, ChangeAuthData, ProfileData, ChatUserFields} from "@models/types"; 
import {restAuthApi, restUsersApi} from "@api/rest";
import {isEqual} from "@lib-utils-kit";

export class UserApi implements AuthUserApi, ChatUserApi, UserProfileApi
{
    registrate (data : RegistrateData) 
    {
        return restAuthApi.post('/signup', data).then( result => result.id as number );
    }
    authorize (data : AuthorizeData)
    {    
        return restAuthApi.post('/signin', data).then(() => {return});
    }
    changeAuthData (data : ChangeAuthData)
    {
        const {login, ...passwordData} = data;

        return restAuthApi.get('/user')
                    .then(profile =>
                    {
                        return (login != profile.login)

                                    ? Promise.all([
                                            restUsersApi.put('/profile', {...profile, login}),
                                            restUsersApi.put('/password', passwordData)
                                        ])
                                        .then(() => {return})

                                    : restUsersApi.put('/password', passwordData).then(() => {return});
                    });
    }
    logout () 
    {
        return restAuthApi.post('/logout').then(() => {return});
    }
    search (login : string) 
    {
        return restUsersApi.post('/search', {login})
                    .then(userDataArr => 
                    {
                        return ( userDataArr as PlainObject[] ).map( userData => UserApi.processUserData(userData) );
                    }); 
    }
    getProfileByID (userID : number) 
    {
        return restUsersApi.get(`/${userID}`).then( userData => UserApi.processUserData(userData) ); 
    }
    setProfile (data : ProfileData) 
    {
        return restAuthApi.get('/user')
                    .then(profile =>
                    {
                        delete profile.id;

                        const {avatar, nickname, ...userData} = data;
                        const profileData = {...userData, display_name: nickname, login: profile.login};

                        const hasProfileChanged = !isEqual(profileData, profile);
                        if (avatar || hasProfileChanged)
                        {
                            if (avatar && hasProfileChanged)
                            {
                                return Promise.all([
                                    restUsersApi.put('/profile', profileData),
                                    restUsersApi.put('/profile/avatar', avatar)
                                ])
                                .then(() => {return});
                            }
                            else if (hasProfileChanged)
                            {
                                return restUsersApi.put('/profile', profileData).then(() => {return});
                            }
                            else if (avatar)
                            {
                                return restUsersApi.put('/profile/avatar', avatar).then(() => {return});
                            }                                                          
                        }
                    });
    }
    getProfile ()
    {
        return restAuthApi.get('/user').then( userData => UserApi.processUserData(userData) ); 
    }
    static processUserData (userData : PlainObject)
    {
        const {id = 0, display_name, ...fields} = userData;
        return {...fields, id, nickname: display_name} as ChatUserFields;
    }
}
const userApi = new UserApi();

export default userApi;

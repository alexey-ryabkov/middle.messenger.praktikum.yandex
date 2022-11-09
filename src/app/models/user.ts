import userProfile from '@data/user.json'; 

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
    get profile ()
    {   
        return profile;
    }
}

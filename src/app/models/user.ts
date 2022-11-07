import userProfile from '@data/user.json'; 

// parcel can ref to image, only if it static string
// so we can`t do it dynamically (get image from json) 
const imageUrl = new URL(
    '../../../static/images/cat.jpg',
    import.meta.url
);
userProfile.image = imageUrl.pathname;

export default class User 
{
    get profile ()
    {
        return userProfile;
    }
}

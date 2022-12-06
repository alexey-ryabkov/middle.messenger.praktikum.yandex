import SurChat from "@app";
import Actions from "@flux/actions";
import componentConnected2store from "@flux/connect";
import {BlockProps} from "@core/block";
import Icon, {IconVar} from "@lib-components/icon";
import IconButton from "@lib-components/icon_button";
import ProfileCard from "@lib-components/profile_card";
import DropdownMenu from "@lib-modules/dropdown_menu";

export type UserProfileCardProps = BlockProps & 
{
    image : string,
    name : string
};
class UserProfileCard extends ProfileCard
{
    constructor (props : UserProfileCardProps)
    {
        const app = SurChat.instance;

        super({
            ...props, 
            menu: new DropdownMenu(
            {
                button: new IconButton({
                    icon: new Icon({ variant: IconVar.circle_dots }), 
                    size: 'regular',
                    importance: 'primary', 
                }),
                options: [
                    {
                        title: 'Редактировать профиль',
                        icon: IconVar.user,
                        action: () => app.go2page('settings'),
                    },
                    {
                        title: 'Настроить доступ',
                        icon: IconVar.shield,
                        action: () => app.go2page('access'),
                    },
                    {
                        title: 'Выйти',
                        icon: IconVar.circle_cross,
                        action: () => Actions.logoutUser(),
                    }
                ]
            })
        });
        this.bemMix(['_userProfile']);
    }   
}
export default componentConnected2store< UserProfileCardProps >(UserProfileCard, () => 
{
    const curUser = SurChat.instance.user.data;
    
    return {image: curUser?.avatar || '', name: curUser?.nickname || ''};
},
'currentUser');

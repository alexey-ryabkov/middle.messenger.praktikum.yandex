import SurChat from "@app";
import componentConnected2store from "@flux/connect";
import {BlockProps} from "@core/block";
import Icon, {IconVar} from "@lib-components/icon";
import IconButton from "@lib-components/icon_button";
import ProfileCard from "@lib-components/profile_card";
import DropdownMenu from "@lib-modules/dropdown_menu";

export type ChatProfileCardProps = BlockProps & 
{
    image : string,
    name : string
};
// TODO differ user chat and group chat 
class ChatProfileCard extends ProfileCard
{
    constructor (props : ChatProfileCardProps)
    {
        super({
            ...props, 
            menu: new DropdownMenu(
            {
                button: new IconButton({
                    icon: new Icon({ variant: IconVar.circle_dots }), 
                    size: 'regular',
                    importance: 'primary', 
                }),
                position: ['top', 'Right'], 
                options: [
                    {
                        title: 'Профиль пользователя',
                        icon: IconVar.user,                        
                        action: () => 
                        {
                            this.props.menu.hideMenu();
                            // TODO
                            alert('Тут будет модальное окно');
                        }
                    },
                    {
                        title: 'Удалить чат пользователя',
                        icon: IconVar.x_mark,
                        action: () => 
                        {
                            const {chatsList} = SurChat.instance;
                            const {activeChat} = chatsList;

                            if (confirm('Вы уверены, что хотите удалить чат?'))
                            {
                                if (activeChat)
                                {
                                    chatsList.deleteChat(activeChat.id)
                                        .catch(error => 
                                        {
                                            console.error(error);
                                            alert('Ошибка при удалении чата: операция не выполнена');
                                        })
                                        .finally(() => 
                                        {
                                            this.props.menu.hideMenu();
                                        });
                                }
                                else
                                    alert('Ошибка при удалении чата: неизвестный чат, операция не выполнена');
                            }
                        }
                    },
                ]
            })
        });
        this.bemMix(['_chatProfile']);
    }   
}
export default componentConnected2store< ChatProfileCardProps >(ChatProfileCard, () => 
{
    const {activeChat} = SurChat.instance.chatsList;
    
    return {image: activeChat?.avatar || '', name: activeChat?.title || ''};
},
'openedChat');

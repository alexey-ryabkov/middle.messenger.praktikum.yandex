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

                            if (activeChat)
                            {
                                chatsList.deleteChat(activeChat.id)
                                    .catch(() => alert('Ошибка при удалении чата: операция не выполнена'));
                            }
                            else
                                alert('Ошибка при удалении чата: неизвестный чат, операция не выполнена');
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

    console.log('ChatProfileCard componentConnected2store', {image: activeChat?.avatar || '', name: activeChat?.title || ''});
    
    return {image: activeChat?.avatar || '', name: activeChat?.title || ''};
},
'openedChat');

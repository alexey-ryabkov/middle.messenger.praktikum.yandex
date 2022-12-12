import SurChat from "@app";
import componentConnected2store from "@flux/connect";
import {ChatType} from "@entities/chat";
import {BlockProps} from "@core/block";
import Icon, {IconVar} from "@lib-components/icon";
import IconButton from "@lib-components/icon_button";
import ProfileCard from "@lib-components/profile_card";
import DropdownMenu, {DropdownMenuOptionProps} from "@lib-modules/dropdown_menu";
import {getUserError} from "@app-utils-kit";

export type ChatProfileCardProps = BlockProps & 
{
    image : string,
    name : string,
    type? : ChatType,
    canModerate? : boolean,
};
class ChatProfileCard extends ProfileCard
{
    constructor (props : ChatProfileCardProps)
    {
        ChatProfileCard._prepareProps( props );

        if (!props.name)
        {
            props.name = '';
        }
        super( props );

        this.bemMix(['_chatProfile']);
    }
    setProps (nextProps : Partial< ChatProfileCardProps >)
    {   
        super.setProps( ChatProfileCard._prepareProps( nextProps ));
    }  
    protected static _prepareProps (props : Partial< ChatProfileCardProps >)
    {   
        if ('type' in props || 'canModerate' in props)
        {
            const options = ChatProfileCard._getOptions( props.type, props.canModerate );
            
            props.menu = new DropdownMenu(
                {
                    button: new IconButton({
                        icon: new Icon({ variant: IconVar.circle_dots }), 
                        size: 'regular',
                        importance: 'primary', 
                    }),
                    position: ['top', 'Right'], 
                    options
                });
        }
        return props;
    } 
    protected static _getOptions (type : ChatType = ChatType.group, canModerate = false) 
    {
        if (ChatType.group == type)
        {
            return [
                {
                    title: 'Данные чата',
                    icon: IconVar.circle_info,                        
                    action: (menu : DropdownMenu | null) => 
                    {
                        menu?.hideMenu();
                        // TODO
                        alert('Тут будет интерфейс с информацией');
                    }
                }, (canModerate ?
                {
                    title: 'Настройки чата',
                    icon: IconVar.gear,                        
                    action: (menu : DropdownMenu | null) => 
                    {
                        menu?.hideMenu();
                        // TODO
                        alert('Тут будет интерфейс настроек чата');
                    }
                } : null), (canModerate ?
                {
                    title: 'Добавить пользователя',
                    icon: IconVar.circle_plus,                        
                    action: (menu : DropdownMenu | null) => 
                    {                        
                        let login = prompt('Введите логин пользователя');
                        if (null !== login)
                        {
                            login = login.trim();
                            if (login)
                            {
                                // TODO here we can handle userInput error type 

                                const {activeChat} = SurChat.instance.chatsList;
                                if (activeChat)
                                {
                                    activeChat.addMember( login )
                                        .then( () =>
                                        {
                                            alert(`Пользователь ${login} добавлен. Теперь он будет получать сообщения из этого чата`);
                                        })
                                        .catch( error => 
                                        {
                                            console.error(error);

                                            let userError = getUserError(error);
                                            if (!userError)
                                            {
                                                userError = 'При добавлении пользователя произошла ошибка';
                                            }
                                            alert('При создании чата произошла ошибка'); 
                                        });
                                }
                            }
                            else
                                alert('Некорректный логин');
                        }
                        menu?.hideMenu();
                    }
                } : null), (
                    canModerate 
                        ? {
                            title: 'Удалить пользователя',
                            icon: IconVar.trash,                        
                            action: (menu : DropdownMenu | null) => 
                            {
                                menu?.hideMenu();
                                // TODO
                                alert('Тут будет интерфейс со списком пользователей');
                            }
                        } 
                        : {
                            title: 'Покинуть чат',
                            icon: IconVar.x_mark,                   
                            action: (menu : DropdownMenu | null) => 
                            {
                                menu?.hideMenu();
                                // TODO
                                alert('Функционал не готов');
                            }
                        }
                ), (canModerate ?
                {
                    title: 'Удалить чат',
                    icon: IconVar.x_mark,                        
                    action: (menu : DropdownMenu | null) => 
                    {
                        menu?.hideMenu();
                        ChatProfileCard._delChatAction();
                    }
                } : null),
            ]
            .filter(opt => !!opt) as DropdownMenuOptionProps[];
        }
        else
            return [
                {
                    title: 'Профиль пользователя',
                    icon: IconVar.user,                        
                    action: (menu : DropdownMenu | null) => 
                    {
                        menu?.hideMenu();
                        // TODO
                        alert('Тут будет модальное окно');
                    }
                }, 
                {
                    title: 'Удалить чат пользователя',
                    icon: IconVar.x_mark,
                    action: (menu : DropdownMenu | null) => 
                    {
                        if (canModerate)
                        {
                            ChatProfileCard._delChatAction();
                        }
                        else
                            alert('Функционал выхода из чата, владельцем которого ты не являешся, не готов');

                        menu?.hideMenu();
                    }
                },
            ]
            .filter(opt => !!opt) as DropdownMenuOptionProps[];
    }
    protected static _delChatAction ()
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
                    });
            }
            else
                alert('Ошибка при удалении чата: неизвестный чат, операция не выполнена');
        }
    }   
}
export default componentConnected2store< ChatProfileCardProps >(ChatProfileCard, () => 
{
    const {activeChat} = SurChat.instance.chatsList; 

    const curUser = SurChat.instance.user.data;     
    const chatCreator = activeChat?.createdBy;

    return {
        image: activeChat?.avatar || '', 
        name: activeChat?.title || '', 
        type: activeChat?.type || ChatType.group,
        canModerate: Boolean(chatCreator?.id && chatCreator?.id == curUser?.id)
    };
},
'openedChat');

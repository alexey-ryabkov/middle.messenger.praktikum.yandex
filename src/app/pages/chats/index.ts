import SurApp from '@app';
import Templator from '@models/templator';
import Page from '@models/page';
import LeftcolWindowLayout from '@lib-layouts/leftcol_window';

import UserProfile from '@app-modules/user_profile';
import Chats from '@app-modules/chats_list';
import ChatProfile from '@app-modules/chat_profile';
import Messages from '@app-modules/messages';

import leftcolTpl from './leftcol.hbs';
import workareaTpl from './workarea.hbs';

const blockName = '_pageChat';
const layout = new LeftcolWindowLayout(SurApp.instance);

const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout(); 

        const leftcol = new Templator(leftcolTpl).compile({
            userProfile: new UserProfile(),
            chats: new Chats()
        });
        const workarea = new Templator(workareaTpl).compile({
            chatProfile: new ChatProfile(),
            message: new Messages()
        });

        this._layout.areas = {leftcol, workarea};
        this._layout.elemBemMix('content', [blockName, 'content']); 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('chats', 'Чаты', blockName);

export default page;

// TODO здесь нужен также евент-бас для связи использования меню 

// const userProfile = new UserProfile(); 
// const chats = new Chats();
// const chatProfile = new ChatProfile();
// const messages = new Messages();

// const leftcolTemplate = new Templator(leftcolTpl);
// const leftcol = new Container(new Templator(leftcolTpl), 
// {
//     userProfile,
//     chats
// });
// const workareaTemplate = new Templator(workareaTpl);
// const workarea = new Container(new Templator(workareaTpl), 
// {
//     chatProfile,
//     messages
// });

// export default new Page(leftcolWindow, { leftcol, workarea }, '_pageChats', 'Чат'); 
// TODO изменение заголовка в зависимости от открытого чата 

// ProfileArea(
// {
//     profile: {
//         name: 'Чуви Чуббака',
//         avatar: '/images/chubbaka.jpg'
//     },
//     menu: {
//         options: {
//             'edit_profile': {
//                 'label': 'Редактировать профиль',
//                 'action': () => {}
//             },
//             'change_pwd': {
//                 'label': 'Настроить доступ',
//                 'action': () => {}
//             },
//             'logout': {
//                 'label': 'Выйти',
//                 'action': () => {},
//                 // link: null, и такой вариант 
//                 'icon': 'close'
//             }
//             /*
//             label: 
//             link:
//             event - структура события 
//             */
//         }
        
//     }
// });

// chat.profile

// плучается мы на этом уровне должны знать структуру данных вьюва
// const chatProfile = ProfileArea(
// {
//     profile: {
//         name: chat.profile.title,//'Джабба Хатт', = chat.members[0].nickname 
//         avatar: chat.profile.avatar // null, = chat.members[0].avatar 
//     },
//     menu: {
//         options: {
//             'info': {
//                 'label': 'Информация',
//                 'action': () => {} // диалоговое окно: ава, никнейм, телефон, настоящее ФИО. видимо передаем chat.profile контроллу модального окна 
//             },
//             'delete': {
//                 'label': 'Удалить',
//                 'action': () => {}, // диалоговое окн конфирм. при подтверджении chatsList.delete(chat) // chat.delete, который вызывает chatList
//                 'icon': 'close'
//             }
//         }        
//     }
// });
// другая сигнатура 
// где контроллер знает 
// название и состав пуктов меню
// интерфейс передаваемого объекта 
// const chatProfile2 = ChatProfile(chat);
// chatProfile2.events.on('show_info', () => {});тогда и события он настраивает там... 

// chatProfile2.view; // передаем в шаблон правой области страницы

// ProfileArea ==> ItemMenu ? 




// -------

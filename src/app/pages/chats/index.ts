import Templator from '../../../lib/@models/templator';
import Page from '../../@models/page';
import Container from '../../../lib/@models/Container';
import leftcolWindow from '../../../lib/layouts/leftcol_window';
import UserProfile from '../../modules/user_profile';
import Chats from '../../modules/chats_list';
import ChatProfile from '../../modules/chat_profile';
import Messages from '../../modules/messages';
import leftcolTpl from './leftcol.hbs';
import workareaTpl from './workarea.hbs';
/*
порядок подключения
-общие компоненты
-общие модули
-контейнер приложения
-компоненты приложения
-модули приложения
-шаблон
-страница
*/

// const app = App.instance;

// @todo здесь нужен также евент-бас для связи использования меню 

const userProfile = new UserProfile(); 
const chats = new Chats();
const chatProfile = new ChatProfile();
const messages = new Messages();

// const leftcolTemplate = new Templator(leftcolTpl);
const leftcol = new Container(new Templator(leftcolTpl), 
{
    userProfile,
    chats
});
// const workareaTemplate = new Templator(workareaTpl);
const workarea = new Container(new Templator(workareaTpl), 
{
    chatProfile,
    messages
});

export default new Page(leftcolWindow, { leftcol, workarea }, '_pageChats', 'Чат'); // @todo изменение заголовка в зависимости от открытого чата 


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

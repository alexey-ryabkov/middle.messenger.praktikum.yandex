
import Page from '../../models/page';
import errorPageLayout from '../../layouts/error_page';
import './style.scss';

const layoutAreas = {
    containerCssClass: '_pageError404__content',
    errorCode: '404',
    errorDesc: 'Кажется, вы не туда попали...',
    chatsPageUrl: '/chats/'
}
export default new Page(errorPageLayout, layoutAreas, '_pageError404', 'Ошибка 404');
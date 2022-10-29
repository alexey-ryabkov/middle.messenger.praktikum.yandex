
import Page from '../../models/page';
import errorPageLayout from '../../layouts/error_page';

const layoutAreas = {
    containerCssClass: '_pageError404__content',
    errorCode: '404',
    errorDesc: 'Кажется, вы не туда попали...',
    chatsPageUrl: '/?page=chats'
}
export default new Page(errorPageLayout, layoutAreas, '_pageError404', 'Ошибка 404');
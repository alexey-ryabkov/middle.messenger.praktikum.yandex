
import Page from '../../models/page';
import errorPageLayout from '../../layouts/error_page';

const layoutAreas = {
    containerCssClass: '_pageError500__content',
    errorCode: '500',
    errorDesc: 'Кажется, что-то сломалось...',
    chatsPageUrl: '/chats/'
}
export default new Page(errorPageLayout, layoutAreas, '_pageError500', 'Ошибка 500');

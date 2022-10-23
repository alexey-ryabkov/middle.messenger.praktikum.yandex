import Layout from '../../models/layout';
import tpl from './tpl.hbs';
import './style.scss';

export default new Layout(tpl, '_errorPageLayout', {
    chatsPageUrl: '/chats/'
});

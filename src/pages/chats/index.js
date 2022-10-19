import Templator from '../../models/templator';
import Page from '../../models/page';
import chatsLayout from '../../layouts/chats';
import tpl from './tpl.hbs';
import './style.scss';

const layoutAreas = {
    containerCssClass: '_pageChats__content',
    content: new Templator(tpl).compile()
}
export default new Page(chatsLayout, layoutAreas, '_pageChats', 'Xfns');
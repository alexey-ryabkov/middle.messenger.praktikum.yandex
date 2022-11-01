import Page from '@models/page';
import CenteredMsgLayout from '@lib-layouts/centered_msg';

const layout = new CenteredMsgLayout({    
    title: '404',
    msg: 'Кажется, вы не туда попали...',   
    url: Page.url('chats') 
});
layout.mixElem('content', ['_pageError404', 'content']); 

export default new Page('error404', layout, {}, '_pageError404', 'Ошибка 404'); 

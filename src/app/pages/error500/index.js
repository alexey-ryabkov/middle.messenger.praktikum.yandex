import Page from '@models/page';
import CenteredMsgLayout from '@lib-layouts/centered_msg';

const layout = new CenteredMsgLayout({    
    title: '500',
    msg: 'Кажется, что-то сломалось...',   
    url: Page.url('chats') 
});
layout.mixElem('content', ['_pageError500', 'content']); 

export default new Page('error500', layout, {}, '_pageError500', 'Ошибка 500');

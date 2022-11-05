import SurChat from '@app';
import Page from '@models/page';
import CenteredMsgLayout from '@lib-layouts/centered_msg';

const layout = new CenteredMsgLayout(SurChat.instance, 
{    
    title: '500',
    msg: 'Кажется, что-то сломалось...',  
    url: Page.url('chats') 
});
const page = new class extends Page
{
    protected get _layout () 
    {
        return layout;
    }
} ('error500', 'Ошибка 500');

export default page;

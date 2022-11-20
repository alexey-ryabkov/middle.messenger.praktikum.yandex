import SurChat from '@app';
import Page from '@core/page';
import CenteredMsgLayout from '@lib-layouts/centered_msg';

const layout = new CenteredMsgLayout(SurChat.instance, 
{    
    title: '404',
    msg: 'Кажется, вы не туда попали...',   
    url: Page.url('messenger') 
});
const page = new class extends Page
{
    protected get _layout () 
    {
        return layout;
    }
} ('error404', 'Ошибка 404');

export default page;

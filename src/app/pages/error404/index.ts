import Page from '@models/page';
import CenteredMsgLayout from '@lib-layouts/centered_msg';

const layout = new CenteredMsgLayout(
{    
    title: '404',
    msg: 'Кажется, вы не туда попали...',   
    url: Page.url('chats') 
});
const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout(); // insertPage2layout
        this._layout.areas = {};
        this._layout.mixElem('content', ['_pageError404', 'content']); 
        // TODO для это страницы ничегоне нужно миксить
        // просто шаблонных код для других страниц 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('error404', 'Ошибка 404', '_pageError404');

export default page;

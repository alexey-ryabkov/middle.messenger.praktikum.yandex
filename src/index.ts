//require('module-alias/register');
import SurChat from './app';
import Page from '@models/page';
import pages from './app/pages';

const app = SurChat.instance;

// dummy page routing

const url = location.href;
const getPage = (pageName : string, defPage : Page = pages['chats']) : Page => pageName in pages ? pages[pageName] : defPage; 
// const go2page = (pageName : string) => location.replace(Page.url(pageName));
const renderPage = (page : Page) => { app.page = page };

const pageName = Page.nameFromUrl(url);

// if (app.user && 'chats' != pageName)
// {
//     go2page('chats');
// }
// else if (!app.user && 'chats' == pageName)
// {
//     go2page('auth');
// }
renderPage(getPage(pageName));

document.body.addEventListener('click', event =>
{
    const element = event.target as Element;

    if ('A' == element.tagName) 
    // TODO ссылкам, которые могут вызывать рутинг надо специальный атрибут добавить 
    {
        event.preventDefault();
        const href = element.getAttribute('href');
        if (href)
        {
            renderPage( getPage( Page.nameFromUrl(href), pages['error404'] ) );
        }        
    }
});

//require('module-alias/register');
import SurApp from './app';
import Page from '@models/page';
import pages from './app/pages';

const app = SurApp.instance;

// dummy page routing

const url = location.href;
const getPage = (pageName : string, defPage : Page = pages['auth']) : Page => pageName in pages ? pages[pageName] : defPage; 
const go2page = (pageName : string) => location.replace(Page.url(pageName));
const renderPage = (page : Page) => { app.page = page };

let pageName = Page.nameFromUrl(url);

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
        renderPage( getPage( Page.nameFromUrl(element.getAttribute('href')), pages['error404'] ) );
    }
});

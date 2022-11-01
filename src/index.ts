//require('module-alias/register');
import App from './app';
import Page from '@models/page';
import pages from './app/pages';

const app = App.instance;

// dummy page routing

const url = location.href;
const getPage = (pageName : string, defPage : Page = pages['error404']) : Page => pageName in pages ? pages[pageName] : defPage; // @todo заменить defPage на auth 
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

    if ('A' == element.tagName) // @todo ссылкам, которые могут вызывать рутинг надо специальный атрибут добавить 
    {
        event.preventDefault();
        renderPage( getPage( Page.nameFromUrl(element.getAttribute('href')), pages['error404'] ) );
    }
});

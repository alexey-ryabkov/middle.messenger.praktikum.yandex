import App from './app';
import Page from './app/models/page';
import pages from './app/pages';

const app = App.instance;

// dummy page routing

const url = location.href;
const getPage = (pageName : string, defPage : Page = pages['error404']) => pageName in pages ? pages[pageName] : defPage; // @todo заменить defPage на auth 
const getPageName = (url : string) => url.replace(/^.*?page\=(\w+).*?$/i, '$1'); // @todo если регулярка не сработала нужо вернуть null
const getPageUrl = (pageName : string) => `/?page=${pageName}`;//url.replace(/^.*?page\=(\w+).*?$/i, '$1');
const go2page = (pageName : string) => location.replace(getPageUrl(pageName));
const renderPage = (page : Page) => { app.page = page };

let pageName = getPageName(url);

if (app.user && 'chats' != pageName)
{
    go2page('chats'); // @todo в метод changePage
}
else if ('chats' == pageName)
{
    go2page('auth');
}
renderPage(getPage(pageName));

document.body.addEventListener('click', event =>
{
    const element = event.target as Element;

    if ('A' == element.tagName) // @todo ссылкам, которые могут вызывать рутинг надо специальный атрибут добавить 
    {
        event.preventDefault();
        renderPage( getPage( getPageName(element.getAttribute('href')), pages['error404'] ) );
    }
});

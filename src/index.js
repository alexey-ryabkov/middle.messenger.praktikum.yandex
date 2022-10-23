import App from './modules/app';
import pages from './pages/';

const app = App.instance;

const getPage = (url, defPage = pages['auth']) => 
{    
    const pageName = url.replace(/^.*?page\=(\w+).*?$/i, '$1');
    return pageName in pages ? pages[pageName] : defPage;
}
let renderPage;
(renderPage = (page) => 
{
    app.page = page;
    app.mount();

}) (getPage(location.href));

document.body.addEventListener('click', event =>
{
    if ('A' == event.target.tagName)
    {
        event.preventDefault();
        renderPage(getPage(event.target.getAttribute('href'), pages['error404']));
    }
});

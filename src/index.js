import App from './app';
import pages from './app/pages';

const app = App.instance;

// проверка прав?

let pageName = 'auth';
if (app.user)
{
    // редирект на чаты
}
// else
// {
    // показываем страницу авторизации
// }

// const getPage = (url, defPage = pages['auth']) => 
// {    
//     const pageName = url.replace(/^.*?page\=(\w+).*?$/i, '$1');
//     return pageName in pages ? pages[pageName] : defPage;
// }
// let renderPage;
// (renderPage = (page) => 
// {
//     app.page = page;
//     app.mount();

// }) (getPage(location.href));

// document.body.addEventListener('click', event =>
// {
//     if ('A' == event.target.tagName)
//     {
//         event.preventDefault();
//         renderPage(getPage(event.target.getAttribute('href'), pages['error404']));
//     }
// });

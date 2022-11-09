import SurChat from '@app';
import Page from '@models/page';
import pages from '../pages';

const defaultPage = pages['profile'];
const fallbackPage = pages['error404'];

export const getPage = (pageName : string, defPage : Page = defaultPage) : Page => pageName in pages ? pages[pageName] : defPage; 

export const renderPage = (page : Page) => { SurChat.instance.page = page };

export const pageNameFromUrl = (url = location.href) => Page.nameFromUrl(url);

export const renderPageWithName = (pageName : string) => renderPage( getPage(pageName) );

export const renderCurPage = () => renderPageWithName( pageNameFromUrl() );

const go2page = (href : string) => renderPage( getPage( pageNameFromUrl(href), fallbackPage ));

export default go2page;

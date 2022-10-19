import App from './modules/app';
import pages from './pages/';

const defaultPage = pages['auth'];
const userPage = location.pathname.replace(/\//g, '');
const appPage = userPage in pages ? pages[userPage] : defaultPage;

const app = App.instance;
app.page = appPage;
app.mount();
import authPage from './auth';
import regPage from './reg';
import profilePage from './profile';
import accessPage from './access';
import chatsPage from './chats';
import error404Page from './error404';
import error500Page from './error500';
import Page from '@models/page';

const pages : Record< string, Page > = {
    auth: authPage, 
    reg: regPage,
    profile: profilePage,
    access: accessPage,
    chats: chatsPage,
    error404: error404Page,
    error500: error500Page
};
export default pages;

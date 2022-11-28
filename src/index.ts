
import SurChat from '@app';
import * as pages from '@pages';
import Actions from '@actions';

const app = SurChat.instance;
app.pages = Object.values( pages );

Actions.defineUser()
    .finally(() => 
    {
        app.init(); 
    });

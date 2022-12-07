import SurChat from '@app';
import * as pages from '@pages';
import Actions from '@flux/actions';

const app = SurChat.instance;
app.pages = Object.values( pages );

Actions.defineUser()
    .finally(() => 
    {
        app.init(); 
    });

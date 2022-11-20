import SurChat from '@app';
import * as pages from '@pages';

const app = SurChat.instance;

app.pages = Object.values( pages );
app.init();

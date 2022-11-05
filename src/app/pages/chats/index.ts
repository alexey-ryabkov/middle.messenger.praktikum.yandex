import SurChat from '@app';
// import Templator from '@models/templator';
import Page from '@models/page';
import LeftcolWindowLayout from '@lib-layouts/leftcol_window';

// import UserProfile from '@app-modules/user_profile';
// import Chats from '@app-modules/chats_list';
// import ChatProfile from '@app-modules/chat_profile';
// import MessagesModule from '@app-modules/messages';

// import leftcolTpl from './leftcol.hbs';
// import workareaTpl from './workarea.hbs';

const blockName = '_pageChat';
const layout = new LeftcolWindowLayout(SurChat.instance);

const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout(); 

        // const leftcol = new Templator(leftcolTpl).compile({
        //     userProfile: new UserProfile(),
        //     chats: new Chats()
        // });
        // const workarea = new Templator(workareaTpl).compile({
        //     chatProfile: new ChatProfile(),
        //     message: new MessagesModule()
        // });

        // this._layout.areas = {leftcol, workarea};
        // this._layout.elemBemMix('content', [blockName, 'content']); 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('chats', 'Чаты', blockName);

export default page;

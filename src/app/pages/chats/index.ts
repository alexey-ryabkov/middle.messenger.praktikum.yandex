import SurChat from '@app';
import Templator from '@models/templator';
import Page from '@models/page';
import LeftcolWindowLayout from '@lib-layouts/leftcol_window';

// import UserProfile from '@app-modules/user_profile';
// import Chats from '@app-modules/chats_list';
// import ChatProfile from '@app-modules/chat_profile';
// import MessagesModule from '@app-modules/messages';

import leftcolTpl from './leftcol.hbs';
import workareaTpl from './workarea.hbs';
import ProfileCard from '@lib-modules/profile-card';
import User from '@models/user';
// import ComponentBlock from '@models/component_block';
// import Block, {BlockProps} from '@models/block';
import ContainerBlock from '@models/container_block';
// import Icon, { IconVar } from '@lib-components/icon';

const blockName = '_pageChat';
const layout = new LeftcolWindowLayout(SurChat.instance);

const app = SurChat.instance;
const user = app.user;

let leftcol : ContainerBlock | '' = '';
let workarea : ContainerBlock | '' = '';

if (user)
{
    const chats = app.chatsList;
    const activeChat = chats.activeChat;

    leftcol = new (class extends ContainerBlock
    {
        constructor ()
        {
            const userProfileCard = new ProfileCard((user as User).profile);
    
            userProfileCard.bemMix(['_userProfile']);
    
            super({ props: {userProfileCard} });
        }
        protected get _template () 
        {
            return new Templator(leftcolTpl);
        }
    }) ();
    workarea = new (class extends ContainerBlock
    {
        constructor ()
        {
            const chatProfileCard = new ProfileCard(activeChat.profile);

            chatProfileCard.bemMix(['_chatProfile']);
    
            super({ props: {chatProfileCard} });
        }
        protected get _template () 
        {
            return new Templator(workareaTpl);
        }
    }) ();
}
const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout(); 

        this._layout.areas = {leftcol, workarea};
        this._layout.elemBemMix('content', [blockName, 'content']); 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('chats', 'Чаты', blockName);

export default page;

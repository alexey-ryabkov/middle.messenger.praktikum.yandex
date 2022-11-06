import SurChat from '@app';
import User from '@models/user';
import Templator from '@models/templator';
import Page from '@models/page';
import ContainerBlock from '@models/container_block';
import ProfileCard from '@lib-modules/profile-card';
import ChatsModule from '@app-modules/chats_list';
import MessagesModule from '@app-modules/messages';
import {MessageProps} from '@app-modules/messages/components/message';
import {ChatProps} from '@app-modules/chats_list/components/chat';
import LeftcolWindowLayout from '@lib-layouts/leftcol_window';
import leftcolTpl from './leftcol.hbs';
import workareaTpl from './workarea.hbs';

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

            const chatsList = new ChatsModule(chats.list as Record< string, ChatProps >);
    
            super({ props: {userProfileCard, chatsList} });
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

            const messages = new MessagesModule(activeChat.messages as Record< string, MessageProps >);
    
            super({ props: {chatProfileCard, messages} });
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

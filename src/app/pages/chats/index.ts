import SurChat from '@app';
import Templator from '@core/templator';
import Page, {PageAccess} from '@core/page';
import ContainerBlock from '@core/block/container';
import ChatsModule from '@app-modules/chats_list';
import MessagesModule from '@app-modules/messages';
import LeftcolWindowLayout from '@lib-layouts/leftcol_window';
import UserProfileCard from '@app-components/user_profile_card';
import ChatProfileCard from '@app-components/chat_profile_card';
import leftcolTpl from './leftcol.hbs';
import workareaTpl from './workarea.hbs';

const blockName = '_pageChat';
const layout = new LeftcolWindowLayout(SurChat.instance);

const leftcol = new class extends ContainerBlock
{
    constructor ()
    {         
        super({props: 
        {
            userProfileCard: new UserProfileCard(), 
            chatsList: new ChatsModule()
        }});
    }
    protected get _template () 
    {
        return new Templator(leftcolTpl);
    }
} ();
const workarea = new class extends ContainerBlock
{
    constructor ()
    {
        super({props: 
        {
            chatProfileCard: new ChatProfileCard(), 
            messages: new MessagesModule()
        }});
    }
    protected get _template () 
    {
        return new Templator(workareaTpl);
    }
} ();
const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout(); 

        this._layout.areas = {leftcol, workarea};

        this._layout.elemBemMix( 'content', [blockName, 'content'] ); 
    }
    protected get _layout () 
    {
        return layout;
    }
} (SurChat.CHAT_PAGE_NAME, 'Чаты', blockName, PageAccess.authorized);

export default page;

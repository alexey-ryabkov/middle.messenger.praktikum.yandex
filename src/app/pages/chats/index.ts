import SurChat from '@app';
import Templator from '@core/templator';
import Page from '@core/page';

import '@api/user'; // UserApi from
import '@api/chats';
import '@api/messages';

import {isJsonString} from '@lib-utils-kit';
// import {StoreEvents} from '@models/store';

import ContainerBlock from '@core/block/container';
import ProfileCard, { ProfileCardProps } from '@lib-modules/profile_card';
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
            // TODO тут запрос или берем из локала? 

            // TODO нужен будет какой-то типа декоратор @handleError(handler) над родительским методом _request 
            // TODO также во все запросы нужно будет указывать xhr.responseType = 'json'; 
            // UserApi.getInfo()
            //     .catch(error => 
            //     {            
            //         console.log(error, error.cause);
            //     });

            // if (error?.cause?.code)
            // {
            //     // if (400 == error.cause.code)
            //     // {
            //     // }                        
            //     if (error?.cause?.response && isJsonString(error.cause.response))
            //     {
            //         const response = JSON.parse(error.cause.response);
            //         console.error(response.reason);
            //     }                        
            // }  

            const userProfileCard = new ProfileCard( user?.profile as ProfileCardProps,  [ 'click', () => console.log('show user menu') ] );  

            // app.store.on(StoreEvents.Updated, () => 
            // {
            //     // TODO мапить свойства 
            //     this.setProps({...app.store.state});
            // });

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
            const chatProfileCard = new ProfileCard( activeChat.profile, [ 'click', () => console.log('show chat menu') ] );

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
} ('messenger', 'Чаты', blockName);

export default page;

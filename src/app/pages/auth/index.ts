import Templator from '@models/templator';
import Page from '@models/page';
// import {EventLsnr} from '@models/types';
import Button from '@lib-components/button';
import InputText, {buildFormFields} from '@lib-components/input-text';
import CenteredFormLayout from '@lib-layouts/centered_form';
import tpl from './tpl.hbs';

const blockName = '_pageAuth';
const layout = new CenteredFormLayout({ title: 'Авторизация' });

const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout(); 

        const fields = '';
        // buildFormFields({ // @todo и тут можно сделать валидацию, прикручивая events к полям  
        //     'Логин': 'login',
        //     'Пароль': 'password',
        // }); 

        const button = new Button(
        {
            label: 'Войти',
            isLink: true,
            href: Page.url('chats'),
            importance: 'primary',
            size: 'big',
            width: 'full' 

        }, ['click', event => 
        {
            event.preventDefault();
            console.log('you pushed it!');
        }]);
        button.mix(['form', 'submitButton']); 
        // TODO тут вставка в шаблон, а не блок, поэтому вставляться должнопо другому... 
        // TODO при такой установке обработчик естесствено работать не будет... 

        const form = new Templator(tpl).compile({
            fields,
            button,
            regUrl: Page.url('reg')
        });

        this._layout.areas = {form};
        this._layout.mixElem('content', [blockName, 'content']); 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('auth', 'Авторизация', blockName);

export default page;

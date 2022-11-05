import SurChat from '@app';
import Templator from '@models/templator';
import Page from '@models/page';
import Button from '@lib-components/button';
import {buildFormFields} from '@lib-components/input-text';
import CenteredFormLayout from '@lib-layouts/centered_form';
import tpl from './tpl.hbs';


const blockName = '_pageAuth';
const layout = new CenteredFormLayout(SurChat.instance, { title: 'Авторизация' });

const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout(); 

        // TODO и тут можно сделать валидацию, прикручивая events к полям  
        const fields = buildFormFields({ 
            'Логин': 'login',
            'Пароль': 'password',
        }); 

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
        button.bemMix(['form', 'submitButton']); 
        // TODO тут вставка в шаблон, а не блок, поэтому вставляться должнопо другому... 
        // TODO при такой установке обработчик естесствено работать не будет... 

        const form = new Templator(tpl).compile({
            fields,
            button,
            regUrl: Page.url('reg')
        });

        this._layout.areas = {form};
        this._layout.elemBemMix('content', [blockName, 'content']); 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('auth', 'Авторизация', blockName);

export default page;

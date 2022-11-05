import SurChat from '@app';
import Templator from '@models/templator';
import Page from '@models/page';
import Button from '@lib-components/button';
import {buildFormFields} from '@lib-components/input-text';
import CenteredFormLayout from '@lib-layouts/centered_form';
import tpl from './tpl.hbs';

const blockName = '_pageAuth';
const layout = new CenteredFormLayout(SurChat.instance, { title: 'Регистрация' });

const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout(); 

        const fields = buildFormFields({ 
            'Почта': 'email',
            'Логин': 'login',
            'Имя': 'first_name',
            'Фамилия': 'second_name',
            'Телефон': 'phone',
            'Пароль': 'password',
            'Пароль (еще раз)': 'password_confirm'
        }); 

        const button = new Button(
        {
            label: 'Зарегистрироваться',
            isLink: true,
            href: Page.url('chats'),
            importance: 'primary',
            size: 'big',
            width: 'full' 

        });
        button.bemMix(['form', 'submitButton']); 

        const form = new Templator(tpl).compile({
            fields,
            button,
            authUrl: Page.url('auth')
        });

        this._layout.areas = {form};
        this._layout.elemBemMix('content', [blockName, 'content']); 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('reg', 'Регистрация', blockName);

export default page;

import SurChat from '@app';
import Page from '@models/page';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import {isEmptyValidator, lengthValidator} from '@lib-utils/form_validation';
import go2page from '@app-utils/dummy_routing';

const blockName = '_pageAuth';
const pageName = 'Авторизация';
const layout = new CenteredFormLayout(SurChat.instance, {title: pageName});

const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout(); 

        const form = new Form(
        {
            formFields: [{
                    name: 'login',
                    label: 'Логин',
                    validatorDefs: [
                        [isEmptyValidator],
                        [lengthValidator, [3, 20]]
                ]}, {
                    name: 'password',
                    label: 'Пароль',
                    type: 'password',
                    validatorDefs: [[isEmptyValidator]],
                }],
            btnLabel: 'Войти',
            onSuccess: () => go2page( Page.url('chats') ),
            link: {
                url: Page.url('reg'),
                title: 'создать аккаунт'
            }
        });

        form.bemMix(['_centeredFormLayout', 'form']);

        this._layout.areas = {form};
        this._layout.elemBemMix('content', [blockName, 'content']); 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('auth', pageName, blockName);

export default page;

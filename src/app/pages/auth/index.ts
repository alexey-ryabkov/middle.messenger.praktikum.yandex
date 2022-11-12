import SurChat from '@app';
import Page from '@models/page';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import InputText from '@lib-components/input-text';
import {isEmptyValidator, lengthValidator, loginValidator, passwordValidator} from '@lib-utils/form_validation';

const app = SurChat.instance;
const blockName = '_pageAuth';
const pageName = 'Авторизация';
const layout = new CenteredFormLayout(app, {title: pageName});

const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout(); 

        const form = new Form(
        {
            formFields: [                
            [
                new InputText({
                    name: 'login',
                    label: 'Логин'             
                }),
                [
                    [ InputText.validationEvents, isEmptyValidator ],                    
                    [ InputText.validationEvents, loginValidator ],
                    [ InputText.validationEvents, lengthValidator, [3, 20] ],
                ]
            ], [
                new InputText({
                    name: 'password',
                    label: 'Пароль',
                    type: 'password'
                }),
                [
                    [ InputText.validationEvents, isEmptyValidator ],
                    [ InputText.validationEvents, passwordValidator ],
                    [ InputText.validationEvents, lengthValidator, [8, 40] ],
                ]  
            ]],
            btnLabel: 'Войти',
            onSuccess: () => app.go2page('messenger'),
            link: {
                url: Page.url('sign-up'),
                title: 'создать аккаунт'
            }
        });

        form.bemMix(['_centeredFormLayout', 'form']);

        this._layout.areas = {form};
        this._layout.elemBemMix('content', [blockName, 'content']); 
    }
    isPathnameMatch (pathname : string)
    {
        return '/' == pathname || super.isPathnameMatch(pathname);
    }
    protected get _layout () 
    {
        return layout;
    }
} ('auth', pageName, blockName);

export default page;

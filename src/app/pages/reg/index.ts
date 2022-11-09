import SurChat from '@app';
import Page from '@models/page';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import InputText from '@lib-components/input-text';
import {emailValidator, isEmptyValidator, lengthValidator, 
    loginValidator, nameValidator, passwordValidator,
    phoneValidator} from '@lib-utils/form_validation';
import go2page from '@app-utils/dummy_routing';

const blockName = '_pageReg';
const pageName = 'Регистрация';
const layout = new CenteredFormLayout(SurChat.instance, {title: pageName});

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
                    name: 'phone',
                    label: 'Телефон'              
                }),
                [
                    [ InputText.validationEvents, isEmptyValidator ],                    
                    [ InputText.validationEvents, phoneValidator ],
                    [ InputText.validationEvents, lengthValidator, [10, 15] ],
                ]
            ], [
                new InputText({
                    name: 'email',
                    label: 'Почта'            
                }),
                [
                    [ InputText.validationEvents, isEmptyValidator ],
                    [ InputText.validationEvents, emailValidator ]
                ]
            ], [
                new InputText({
                    name: 'first_name',
                    label: 'Имя'             
                }),
                [
                    [ InputText.validationEvents, isEmptyValidator ],
                    [ InputText.validationEvents, nameValidator ],
                ]
            ], [
                new InputText({
                    name: 'last_name',
                    label: 'Фамилия'              
                }),
                [
                    [ InputText.validationEvents, isEmptyValidator ],
                    [ InputText.validationEvents, nameValidator ],
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
            ], [
                new InputText({
                    name: 'password_confirm',
                    label: 'Пароль (еще раз)',
                    type: 'password'
                }),
                [
                    [ InputText.validationEvents, isEmptyValidator ],                    
                    [ InputText.validationEvents, passwordValidator ],
                    [ InputText.validationEvents, lengthValidator, [8, 40] ],
                ]
            ]],
            btnLabel: 'Зарегистрироваться',
            onSuccess: () => go2page( Page.url('chats') ),
            link: {
                url: Page.url('auth'),
                title: 'войти'
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
} ('reg', pageName, blockName);

export default page;

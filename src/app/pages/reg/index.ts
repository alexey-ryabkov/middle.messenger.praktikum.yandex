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
                    [ ['focus', 'blur'], lengthValidator, [3, 20] ],
                    [ ['focus', 'blur', 'keyup'], loginValidator ]
                ]
            ], [
                new InputText({
                    name: 'phone',
                    label: 'Телефон'              
                }),
                [
                    [ ['focus', 'blur'], lengthValidator, [10, 15] ],
                    [ ['focus', 'blur', 'keyup'], phoneValidator ]
                ]
            ], [
                new InputText({
                    name: 'email',
                    label: 'Почта'            
                }),
                [
                    [ ['focus', 'blur'], isEmptyValidator ],
                    [ ['focus', 'blur', 'keyup'], emailValidator ]
                ]
            ], [
                new InputText({
                    name: 'first_name',
                    label: 'Имя'             
                }),
                [
                    [ ['focus', 'blur'], isEmptyValidator ],
                    [ ['focus', 'blur', 'keyup'], nameValidator ]
                ]
            ], [
                new InputText({
                    name: 'last_name',
                    label: 'Фамилия'              
                }),
                [
                    [ ['focus', 'blur'], isEmptyValidator ],
                    [ ['focus', 'blur', 'keyup'], nameValidator ]
                ]
            ], [
                new InputText({
                    name: 'password',
                    label: 'Новый пароль'              
                }),
                [
                    [ ['focus', 'blur'], lengthValidator, [8, 40] ],
                    [ ['focus', 'blur', 'keyup'], passwordValidator ]
                ]  
            ], [
                new InputText({
                    name: 'password_confirm',
                    label: 'Пароль (еще раз)'             
                }),
                [
                    [ ['focus', 'blur'], lengthValidator, [8, 40] ],
                    [ ['focus', 'blur', 'keyup'], passwordValidator ]
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

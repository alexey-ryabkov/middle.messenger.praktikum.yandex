import SurChat from '@app';
import Page, {PageAccess} from '@core/page';
import {AppErrorCode, RegistrateData} from '@models/types';
import Actions from '@flux/actions';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import InputText from '@lib-components/input-text';
import {emailValidator, isEmptyValidator, lengthValidator, 
    loginValidator, nameValidator, passwordValidator,
    phoneValidator} from '@lib-utils/form_validation';
import {createAppError} from '@app-utils-kit';

const blockName = '_pageReg';
const pageName = 'Регистрация';
const layout = new CenteredFormLayout( SurChat.instance, {title: pageName} );

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
                    name: 'second_name',
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
                    name: 'confirmPassword',
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
            onSubmit: (data : FormData) =>
            {
                const regData = <unknown>Object.fromEntries(data) as RegistrateData  & { confirmPassword? : string };

                if (regData.confirmPassword != regData.password)
                {
                    return Promise.reject( createAppError('Пароль не совпадает с проверочным (поле "Пароль еще раз")', AppErrorCode.userInput) );
                }
                return Actions.createUser(regData);
            },
            link: {
                url: Page.url('sign-in'),
                title: 'войти'
            }
        });
        form.bemMix([ '_centeredFormLayout', 'form' ]);

        this._layout.areas = {form};
        this._layout.elemBemMix( 'content', [blockName, 'content'] ); 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('sign-up', pageName, blockName, PageAccess.nonAuthorized);

export default page;

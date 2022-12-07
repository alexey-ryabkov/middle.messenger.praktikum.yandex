import SurChat from '@app';
import Page, {PageAccess} from '@core/page';
import {AuthorizeData} from '@models/types';
import Actions from '@flux/actions';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import InputText from '@lib-components/input-text';
import {isEmptyValidator, lengthValidator, loginValidator, passwordValidator} from '@lib-utils/form_validation';

const blockName = '_pageAuth';
const pageName = 'Авторизация';
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
                [[ InputText.validationEvents, isEmptyValidator ]]
            ], [
                new InputText({
                    name: 'password',
                    label: 'Пароль',
                    type: 'password'
                }),
                [[ InputText.validationEvents, isEmptyValidator ]]  
            ]],
            btnLabel: 'Войти',
            onSubmit: (data : FormData) =>
            {
                const authData = <unknown>Object.fromEntries(data) as AuthorizeData;

                return Actions.authorizeUser(authData);
            },
            link: {
                url: Page.url('sign-up'),
                title: 'создать аккаунт'
            }
        });
        form.bemMix([ '_centeredFormLayout', 'form' ]);

        this._layout.areas = {form};
        this._layout.elemBemMix( 'content', [blockName, 'content'] ); 
    }
    isPathnameMatch (pathname : string)
    {
        return '/' == pathname || super.isPathnameMatch(pathname);
    }
    protected get _layout () 
    {
        return layout;
    }
} (SurChat.AUTH_PAGE_NAME, pageName, blockName, PageAccess.nonAuthorized);

export default page;

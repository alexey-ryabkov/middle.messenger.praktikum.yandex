import SurChat from '@app';
import Store from '@core/store';
import Page, {PageAccess} from '@core/page';
import {AppErrorCode, ChangeAuthData} from '@entities/types';
import Actions from '@flux/actions';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import InputText from '@lib-components/input-text';
import {isEmptyValidator, lengthValidator, loginValidator, passwordValidator} from '@lib-utils/form_validation';
import {createAppError} from '@app-utils-kit';

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
            name: 'oldPassword',
            label: 'Старый пароль',
            type: 'password'
        }),
        [
            [ InputText.validationEvents, isEmptyValidator ],
            [ InputText.validationEvents, passwordValidator ],
            [ InputText.validationEvents, lengthValidator, [8, 40] ],
        ]
    ], [
        new InputText({
            name: 'newPassword',
            label: 'Новый пароль',
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
    btnLabel: 'Сохранить',
    onSubmit: (data : FormData) =>
    {
        const accessData = <unknown>Object.fromEntries(data) as ChangeAuthData  & { confirmPassword? : string };
        
        if (accessData.confirmPassword != accessData.newPassword)
        {
            return Promise.reject( createAppError('Новый пароль не совпадает с проверочным (поле "Пароль еще раз")', AppErrorCode.userInput) );
        }
        delete accessData.confirmPassword;

        return Actions.changeUserAuthData(accessData);
    },
    link: {
        url: Page.url('messenger'),
        title: 'к чатам'
    }
});
form.bemMix(['_centeredFormLayout', 'form']);

const app = SurChat.instance;
app.store.on( Store.getEventName4path('currentUser'), () =>
{
    console.log(`store.on fired, profile page`, Store.getEventName4path('openedChat'));

    const curUser = app.user.data;

    form.setProps({
        fieldsValues: {
            login: curUser?.login || '',
        }
    });
});

const blockName = '_pageAccess';
const pageName = 'Настройка доступа';
const layout = new CenteredFormLayout( app, {title: pageName} );

const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout();
        
        this._layout.areas = {form};
        this._layout.elemBemMix( 'content', [blockName, 'content'] ); 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('access', pageName, blockName, PageAccess.authorized);

export default page;

import SurChat from '@app';
import Page from '@models/page';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import {isEmptyValidator, lengthValidator, phoneValidator} from '@lib-utils/form_validation';
import InputText from '@lib-components/input-text';
import go2page from '@app-utils/dummy_routing';

const app = SurChat.instance;
const user = app.user;

let form : Form | '' = '';

if (user)
{
    const userProfile = user.profile;

    form = new Form(
    {
        formFields: [                
        [
            new InputText({
                name: 'login',
                label: 'Логин',   
                value: userProfile.login                 
            }),
            [
                [ ['focus', 'blur'], isEmptyValidator ],
                [ ['focus', 'blur'], lengthValidator, [3, 20] ]
            ]
        ], [
            new InputText({
                name: 'password_old',
                label: 'Старый пароль'              
            })
        ], [
            new InputText({
                name: 'password_new',
                label: 'Новый пароль'              
            })  
        ], [
            new InputText({
                name: 'password_confirm',
                label: 'Новый пароль'              
            })    
        ], [
            new InputText({
                name: 'password_confirm',
                label: 'Пароль (еще раз)'             
            })
        ]],
        btnLabel: 'Сохранить',
        onSuccess: () => go2page( Page.url('chats') ),
        link: {
            url: Page.url('chats'),
            title: 'к чатам'
        }
    });
    form.bemMix(['_centeredFormLayout', 'form']);
}

const blockName = '_pageAccess';
const pageName = 'Настройка доступа';
const layout = new CenteredFormLayout(app, {title: pageName});

const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout();
        
        this._layout.areas = {form};
        this._layout.elemBemMix('content', [blockName, 'content']); 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('access', pageName, blockName);

export default page;

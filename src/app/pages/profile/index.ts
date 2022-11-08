import SurChat from '@app';
import Page from '@models/page';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import {isEmptyValidator, lengthValidator, phoneValidator} from '@lib-utils/form_validation';
import InputText from '@lib-components/input-text';
import InputImage from '@lib-components/input-image';
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
            new InputImage({
                name: 'avatar',
                label: 'Аватар',
                image: userProfile.image
            })
        ], [
            new InputText({
                name: 'nickname',
                label: 'Никнейм',   
                value: userProfile.nickname                 
            }),
            [
                [ ['focus', 'blur'], isEmptyValidator ], 
                [ ['focus', 'blur'], lengthValidator, [3, 20] ]
            ]
        ], [
            new InputText({
                name: 'phone',
                label: 'Телефон',   
                value: userProfile.phone                 
            }),
            [
                [ ['focus', 'blur'], isEmptyValidator ], 
                [ ['focus', 'blur', 'keyup'], phoneValidator ]
            ]
        ], [
            new InputText({
                name: 'email',
                label: 'Почта',   
                value: userProfile.email                 
            }),
            [
                [ ['focus', 'blur'], isEmptyValidator ]
            ]
        ], [
            new InputText({
                name: 'first_name',
                label: 'Имя',   
                value: userProfile.first_name                 
            })
        ], [
            new InputText({
                name: 'last_name',
                label: 'Фамилия',   
                value: userProfile.last_name                 
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

const blockName = '_pageProfile';
const pageName = 'Редактирование профиля';
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
} ('profile', pageName, blockName);

export default page;

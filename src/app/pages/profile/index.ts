import SurChat from '@app';
import Page, {PageAccess} from '@core/page';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import {emailValidator, isEmptyValidator, lengthValidator, nameValidator, phoneValidator} from '@lib-utils/form_validation';
import InputText from '@lib-components/input-text';
import InputImage from '@lib-components/input-image';

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
                [ InputText.validationEvents, isEmptyValidator ],
            ]
        ], [
            new InputText({
                name: 'phone',
                label: 'Телефон',   
                value: userProfile.phone                 
            }),
            [
                [ InputText.validationEvents, isEmptyValidator ],
                [ InputText.validationEvents, phoneValidator ],
                [ InputText.validationEvents, lengthValidator, [10, 15] ],
            ]
        ], [
            new InputText({
                name: 'email',
                label: 'Почта',   
                value: userProfile.email                 
            }),
            [
                [ InputText.validationEvents, isEmptyValidator ],
                [ InputText.validationEvents, emailValidator ],
            ]
        ], [
            new InputText({
                name: 'first_name',
                label: 'Имя',   
                value: userProfile.first_name                 
            }),
            [
                [ InputText.validationEvents, isEmptyValidator ],
                [ InputText.validationEvents, nameValidator ],
            ]
        ], [
            new InputText({
                name: 'last_name',
                label: 'Фамилия',   
                value: userProfile.last_name                 
            }),
            [
                [ InputText.validationEvents, isEmptyValidator ],
                [ InputText.validationEvents, nameValidator ],
            ]
        ]],
        btnLabel: 'Сохранить',
        onSuccess: () => app.go2page('messenger'),
        link: {
            url: Page.url('messenger'),
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
} ('settings', pageName, blockName, PageAccess.authorized);

export default page;

import SurChat from '@app';
import Store from '@core/store';
import Page, {PageAccess} from '@core/page';
import {ProfileData} from '@entities/types';
import Actions from '@flux/actions';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import {emailValidator, isEmptyValidator, lengthValidator, nameValidator, phoneValidator} from '@lib-utils/form_validation';
import InputText from '@lib-components/input-text';
import InputImage from '@lib-components/input-image';

const form = new Form(
{
    formFields: [                
    [
        new InputImage({
            name: 'avatar',
            label: 'Аватар'
        })
    ], [
        new InputText({
            name: 'nickname',
            label: 'Никнейм'             
        }),
        [
            [ InputText.validationEvents, isEmptyValidator ],
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
            [ InputText.validationEvents, emailValidator ],
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
    ]],
    btnLabel: 'Сохранить',
    onSubmit: (data : FormData) =>
    {
        const profileData = <unknown>Object.fromEntries(data) as ProfileData;
        const avatar = data.get('avatar') as File;

        if (avatar.name)
        {
            ( profileData.avatar = new FormData() ).append( 'avatar', avatar, avatar.name );
        }
        else
            profileData.avatar = null;        

        return Actions.changeUserProfile(profileData);
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
    const curUser = app.user.data;

    form.setProps({
        fieldsValues: {
            avatar: curUser?.avatar || '',
            nickname: curUser?.nickname || '',
            phone: curUser?.phone || '',  
            email: curUser?.email || '',
            first_name: curUser?.first_name || '',
            second_name: curUser?.second_name || '', 
        }
    });
});

const blockName = '_pageProfile';
const pageName = 'Редактирование профиля';
const layout = new CenteredFormLayout(app, {title: pageName});

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
} ('settings', pageName, blockName, PageAccess.authorized);

export default page;

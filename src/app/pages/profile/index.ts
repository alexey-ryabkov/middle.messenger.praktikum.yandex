import SurChat from '@app';
import Page from '@models/page';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import {isEmptyValidator, lengthValidator, phoneValidator} from '@lib-utils/form_validation';
import go2page from '@app-utils/dummy_routing';

const blockName = '_pageProfile';
const pageName = 'Профиль';
const layout = new CenteredFormLayout(SurChat.instance, {title: pageName});

const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout(); 

        const form = new Form(
        {

            // TODO нужно передавать компоненты InputText и проч. 
            // TODO также тут нужны текущие данные в value 
            // TODO и видимо страница доступа

            formFields: [{
                    name: 'avatar',
                    label: 'Аватар',
                    type: 'image'
                }, {
                    name: 'nickname',
                    label: 'Никнейм',
                    validatorDefs: [
                        [isEmptyValidator],
                        [lengthValidator, [3, 20]]
                ]}, {
                    name: 'phone',
                    label: 'Телефон',
                    validatorDefs: [
                        [isEmptyValidator],
                        [phoneValidator]]
                }, {
                    name: 'email',
                    label: 'Почта',
                    validatorDefs: [[isEmptyValidator]]
                }, {
                    name: 'first_name',
                    label: 'Имя'
                }, {
                    name: 'second_name',
                    label: 'Фамилия'
                }],
            btnLabel: 'Сохранить',
            onSuccess: () => go2page( Page.url('chats') ),
            link: {
                url: Page.url('chats'),
                title: 'к чатам'
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
} ('profile', pageName, blockName);

export default page;

import SurChat from '@app';
import Page from '@models/page';
import Form from '@lib-modules/form';
import CenteredFormLayout from '@lib-layouts/centered_form';
import {isEmptyValidator, lengthValidator} from '@lib-utils/form_validation';
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
            formFields: [{
                    name: 'email',
                    label: 'Почта',
                    validatorDefs: [[isEmptyValidator]]
                }, {
                    name: 'login',
                    label: 'Логин',
                    validatorDefs: [
                        [isEmptyValidator],
                        [lengthValidator, [3, Infinity]]
                ]}, {
                    name: 'first_name',
                    label: 'Имя'
                }, {
                    name: 'second_name',
                    label: 'Фамилия'
                }, {
                    name: 'phone',
                    label: 'Телефон',
                    validatorDefs: [[isEmptyValidator]]
                }, {
                    name: 'password',
                    label: 'Пароль',
                    type: 'password',
                    validatorDefs: [
                        [isEmptyValidator],
                        [lengthValidator, [5, 20]]
                ]}, {
                    name: 'password',
                    label: 'Пароль (еще раз)',
                    type: 'password_confirm',
                    validatorDefs: [
                        [isEmptyValidator],
                        [lengthValidator, [5, 20]]
                ]}],
            btnLabel: 'Зарегистрироваться',
            onSuccess: () => go2page( Page.url('chats') ),
            link: {
                url: Page.url('reg'),
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

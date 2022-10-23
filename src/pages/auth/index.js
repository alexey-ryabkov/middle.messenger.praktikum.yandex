import Templator from '../../models/templator';
import Page from '../../models/page';
import signFormLayout from '../../layouts/sign_form';
import '../../components/button';
import '../../components/input-text';
import tpl from './tpl.hbs';
import './style.scss';

const layoutAreas = {
    containerCssClass: '_pageAuth__content',
    formTitle: 'Авторизация',
    form: new Templator(tpl).compile({
        regPageUrl: '/reg/',
        fields: {
            'Логин': {
                name: 'login',
                type: 'text',
                cssClass: 'form__field',
            },
            'Пароль': {
                name: 'password',
                type: 'password',
                cssClass: 'form__field',
            }
        },
        button: {
            label: 'Войти',
            isLink: true,
            href: '/chats/',
            cssClass: 'form__submitButton button--importance_primary button--size_big button--width_full'
        }
    })
}
export default new Page(signFormLayout, layoutAreas, '_pageAuth', 'Авторизация');

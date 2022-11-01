import Templator from '../../../lib/@models/templator';
import Page from '../../@models/page';
// import Container from '../../../lib/@models/Container';
import centeredFormLayout from '../../../lib/layouts/centered_form';
import Button from '../../../lib/components/button';
import InputText from '../../../lib/components/input-text';
import tpl from './tpl.hbs';

const layoutAreas = {
    containerCssClass: '_pageAuth__content',
    formTitle: 'Авторизация',
    form: new Templator(tpl).compile({
        regPageUrl: '/?page=reg',
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
            href: '/?page=chats',
            cssClass: 'form__submitButton button--importance_primary button--size_big button--width_full'
        }
    })
}
export default new Page(centeredFormLayout, layoutAreas, '_pageAuth', 'Авторизация');

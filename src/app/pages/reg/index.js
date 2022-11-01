import Templator from '../../@models/templator';
import Page from '../../@models/page';
import layout from '../../layouts/sign_form';
import Button from '../../components/button'; 
import InputText from '../../components/input-text';
import tpl from './tpl.hbs';
import './style.scss';

const fldDef = {
    type: 'text',
    cssClass: 'form__field'
};
const fields = Object.fromEntries(Object.entries({
    'Почта': 'email',
    'Логин': 'login',
    'Имя': 'first_name',
    'Фамилия': 'second_name',
    'Телефон': 'phone',
    'Пароль': 'password',
    'Пароль (еще раз)': 'password_confirm'

}).map(([label, name]) => [label, new InputText({name, ...fldDef}).render()]));

const button = new Button({
    label: 'Зарегистрироваться',
    isLink: true,
    href: '/?page=chats',
    cssClass: 'form__submitButton',
    importance: 'primary',
    size: 'big',
    width: 'full'
}).render();

const layoutAreas = {
    containerCssClass: '_pageReg__content',
    formTitle: 'Регистрация',
    form: new Templator(tpl).compile({
        fields,
        button,        
        authPageUrl: '/?page=auth',
    })
}
export default new Page(layout, layoutAreas, '_pageReg', 'Регистрация');

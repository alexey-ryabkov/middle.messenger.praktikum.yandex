import Templator from '../../../lib/models/templator';
import Page from '../../models/page';
import Container from '../../../lib/models/container';
import tpl from './tpl.hbs';
import './style.scss';

type Content = HTMLElement | string; // @todo типа содержимое шаблона
type MainContainerContent = Page | HTMLElement | string;

export default class MainContainer extends Container
{
    constructor (pageHolder : Content) 
    {   
        super(new Templator(tpl),
        {
            props: {
                node: document.body,
                page: pageHolder,
            },
            bem: {
                name: '_appSur',
                mods: {
                    elems: {
                        workarea: [['bg', 'image']] // @todo попробовать там тип SingleOrPlural 
                    }
                }
            }
        });
    }
    set page (page : MainContainerContent)
    {
        if (page instanceof Page)
        {
            page = newPage.view.element; // @todo да, getContent как-то посемантичнее будет 
            this.view.mix(['somePage']); // @todo страница должна будет отдавать свой класс блока 
        }            
        this.view.props = {page};
        // @todo по идее настройки css при установке page также должны быть здесь ... 
    }
}

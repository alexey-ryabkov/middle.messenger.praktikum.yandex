// import Templator from '../../models/templator';
// import _Module from '../../models/_module';
import {unique} from '../../utils';
// import tpl from './tpl.hbs';
// import './style.scss';

// const APP_ROOT_CSSCLASS = '_surApp';
// const APP_CONTAINER_CSSCLASS = '_surApp__workarea';
// const APP_BGBOX_CSSCLASS = '_surApp__background _surApp__background--bg_image';
// const INITIALIZE_MSG = 'Загрузка приложения...';
const APP_SINGLETON_TOKEN = Symbol();

export default class App 
{
    _page = null;
    
    constructor (token) // синглтон 
    {        
        // super();
        if (APP_SINGLETON_TOKEN !== token)
        {
            throw new Error('This class cannot instantiate directly')
        }        
        // this.rootCssClass = '';
        // this.title = INITIALIZE_MSG;
        // this.props = {
        //     appContainerCssClass: APP_CONTAINER_CSSCLASS,
        //     appBgBoxCssClass: APP_BGBOX_CSSCLASS,
        //     page: INITIALIZE_MSG
        // }
    }    
    static get instance () 
    {        
        if (!this[APP_SINGLETON_TOKEN])
        {
            this[APP_SINGLETON_TOKEN] = new App(APP_SINGLETON_TOKEN);
        }
        return this[APP_SINGLETON_TOKEN];
    }
    // _initTemplate () 
    // {
    //     this.template = new Templator(tpl);
    // }
    get chatsList ()
    {
        
    }
    get user ()
    {
        
    }
    set page (page)
    {
        this._page = page;
        // @todo настраивать пропсы модуля-контейнера
        // this.rootCssClass = this._page.rootCssClass;
        // this.title = this._page.title;
    } 
    // @todo настраивать пропсы модуля-контейнера
    // set title (title)
    // {
    //     title = String(title).trim();
    //     document.title = `Sur chat${title ? ': '+title : ''}`; 
    // }
    // set rootCssClass (cssClass = '')
    // {
    //     document.body.className = unique([APP_ROOT_CSSCLASS, cssClass]).join(' ').trim();
    // }
    // get container ()
    // {
    //     return document.getElementsByClassName(APP_CONTAINER_CSSCLASS)[0];
    // }
    // render ()
    // {
    //     this.props.page = this._page?.render() ?? '';
    //     return super.render();
    // }
    mount () // @todo перемонтировать главный модуль (со всем его содержимым)
    {
        // return super.mount(document.body);
    }
    // static rootCssClass = () => APP_ROOT_CSSCLASS;
    // static containerCssClass = () => APP_CONTAINER_CSSCLASS;
}

import { v4 as makeUUID } from 'uuid';
import EventEmitter from './event_emitter';

import {SingleOrPlural, EventLsnr} from './types';


import {addMixin} from '../utils';
import CssClsHelperMixin, {CssCls, HTMLElementCssCls} from '../utils/css_cls_helper';
import EventsHelperMixin, {HTMLElementEvnts} from '../utils/events_helper';


// type HTMLElementExt = HTMLElement | HTMLElementCssCls | HTMLElementCssCls;

export interface HTMLElementExt extends HTMLElement, HTMLElementCssCls, HTMLElementEvnts
{}
export function makeHTMLElementExt (element : HTMLElement) : HTMLElementExt
{
    addMixin(element, CssClsHelperMixin);
    addMixin(element, EventsHelperMixin);
    return element as HTMLElementExt;
}


type CompProps = Record< string, any >; // key?: CompKey, @todo как один из пропсов 
type CompElement = HTMLElement | string;
type CompKey = number | string;
export type CompParams = 
{
    asElement? : CompElement,    
    props? : CompProps,    
    cssCls? : CssCls,    
    events? : SingleOrPlural<EventLsnr>,
    settings? : Record< string, any >
}
// attrs? : Record< string, string[] | string >, // @todo 

// type BemBlockProps = <
// {
//     [key: string] : unknown,
//     elements? : Record< string, string[] | string >,
// } extends DomComponentProps>;

// type Proplist = {
//     name: string;
//     selector: string;
//     attribute: string;
//     isValue?: boolean;
// }[];


/*

@todo то как идет рендеринг чайлдов и решения по ...
определять стратегиями
renderDelegate с интерфейсом render

*/


// а что если передавать ссылку на родителя? 

// @todo инкапсулировать логику, которая отвечает за выбранный шаблонизатор 


export default abstract class DomComponent extends EventEmitter
{
    protected _id : string; 
    protected _element : HTMLElementExt; 
    // protected _element : DomElement; 
    protected _props : CompProps;
    // protected _className : CssClassName; // @todo делать через декаратор 
    protected _meta : Record< string, any > = {};


    EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_RENDER: "flow:render"
    };
    /*
    события:
    этого компонента внешние
    этого компонента внутренние (жизненный цикл)

    DomEvents
    ComponentEvents
    ComponentFlow

     */

    // _eventBus = null;
    // protected state:object = {};

    // asElement : CompElement = 'div'

    constructor (params : CompParams = {}) 
    {
        super();

        this._id = makeUUID();

        const {asElement, key, props: propsAnComphildren, events, cssCls = '', attrs} = params; // @todo для children нужно обработать props 


        // const {props, children} = this._separateChildrenFromProps(propsAnComphildren);



        this._meta = {asElement, key, props, cssCls}; // , events, cssCls, children

        // this._props = this._makePropsProxy(props);

        // this._eventBus = new EventBus();
        // this._registerEvents();

        // this.eventBus.emit(Block.EVENTS.INIT);
    }
    get element () 
    {
        return this._element;
    }
    get className () 
    {
        return this._className;
    }


    // get eventBus () 
    // {
    //     return this._eventBus;
    // }

    // getContent () 
    // {
    //     return this.element;
    // }
    setProps (nextProps)
    {
        if (!nextProps) 
        {
            return;
        }
        Object.assign(this._props, nextProps);
    }
    dispatchComponentDidMount () 
    {
        // this.eventBus.emit(Block.EVENTS.FLOW_CDM);
    }  
    show () 
    {
        this._element.style.display = 'block';
    }
    hide () 
    {
        this._element.style.display = 'none';
    }
    
    init () 
    {
        this._processElement();
        this._processClassName(); 


        // this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }  
    componentDidMount (oldProps) 
    {}
    componentDidUpdate (oldProps, newProps) 
    {
        return true; 
    }
    abstract render () 
    {}

    // protected _registerEvents () 
    // {
    //     this.eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    //     this.eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    //     this.eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    //     this.eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    // }
    _makePropsProxy (props) 
    {
        props = new Proxy(props, 
        {
            set: (target, prop, value) =>
            {
                const oldProps = Object.assign({}, this._meta.props);
                target[prop] = value;

                console.log(oldProps, target);

                this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);

                this._meta.props = target;
                return true;
            },
            deleteProperty (target, prop)
            {
                throw new Error('Нет доступа');
            }
        });
        return props;
    }

    protected _processElement () 
    {
        const {asElement, cssCls} = this._meta;        
        const element = 'string' ==  typeof asElement ? document.createElement(asElement) : asElement.cloneNode(false);

        this._element = makeHTMLElementExt(element);
        this._element.addCssCls(cssCls);
    }
    protected _processProps (props : CompProps)
    {
        const processed = {};

        /*
        @todo здесь не нужно ничего process, нужнопросто найти все чилдрены, не удаляя их из пропсов 
        чтобы задиспачить о маунте этогохватит
        если нужно дать вовне доступ для настройки пропсов, то
        можно фильтровать дерево оставляя только компоненты (отдавать sub-? components)

        если мы передали компонет, то он уже с заданными пропсами. 
        потом если мы настраиваем пропсы, то по этому пути можем передавтать объект настроек.
        если передается другой компонент или примитив, то оно заменит собой компонент в шаблоне  

        если пропсы дочернего элемента не поменялись, то по идее его не нужно рендерить... хранить кеш рендеров? 

        менять events ? для childs? другие параметры для childs? 

        */

        Object.entries(props).forEach((value, name) => 
        {
            if (value instanceof DomComponent) 
            {
                // children[name] = value; @todo по идее просто созранять ссылку.. но тогда мы в рекурсии должны сохранить объект. можно через Map ? 
            } 
            else if (value instanceof Array)
            {
                processed[name] = []
                value.forEach((val, key) => 
                {
                    if (val instanceof DomComponent)
                    {
                        // @todo 
                    }
                    else if ('object' == typeof val)
                    {
                        val = this._processProps(val);
                    }                    
                    processed[name][key] = val;
                });
            }
            else if ('object' == typeof value)
            {
                processed[name] = this._processProps(value);
            }
            else
            {
                processed[name] = value;
            }
        });
        return processed;
    }


    protected _separateChildrenFromProps (propsAnComphildren)
    {
        const children = {}; // @todo помимо этого мб этого мб еще массивы 
        const props = {};

        Object.entries(propsAnComphildren).forEach(([key, value]) => 
        {
            if (value instanceof Block) {
            children[key] = value;
            } else {
            props[key] = value;
            }
        });
        return { children, props };
    }

    _componentDidMount () 
    {
        this.componentDidMount(this.props);
    }
    _componentDidUpdate(oldProps, newProps) 
    {
        if (this.componentDidUpdate(oldProps, newProps))
        {
            this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
        }
    }
    _render() 
    {
        const block = this.render();

        // this._element.clearEvents();
        this._element.innerHTML = ''; 

        // this._element.appendChild(block);

        // this._element.attachEvents(); @todo откуда брать события, если они с пропсами не придут?
        // мб event, который полностью перезаписывает через сеттер события?
    }  

    // set events (lsnrs : SingleOrPlural<EventLsnr>)
    // {
    //     // this._element.clearEvents();
    //     // this._element.attachEvents(lsnrs); // @todo мб имеет смысл также назвать типа addEventListentrs
    //     // @todo лучше отдавать element чем 
    //     // и как-то по другому называть, чтоб отличать от HTMLElement ... 
    //     // this.domElement.element ... 

    //     // мб миксином подмешать функциональность из класса? чем лепить новый класс...
    //     // но с событиями проблеме в кешере... но его опять же можно сделать свойством элемента
    // }
}

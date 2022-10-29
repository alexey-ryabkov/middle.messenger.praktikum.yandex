import { v4 as makeUUID } from 'uuid';
import EventEmitter from './event_emitter';
import EventBus from './event_bus';

import {Nullable, SingleOrPlural, EventLsnr} from './types';


// import {addMixin} from '../utils';
import CssClsHelperMixin, {CssCls, HTMLElementCssCls} from '../utils/css_cls_helper';
import EventsHelperMixin, {HTMLElementEvnts} from '../utils/events_helper';


// type HTMLElementExt = HTMLElement | HTMLElementCssCls | HTMLElementCssCls;

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



export interface HTMLElementExt extends HTMLElement, HTMLElementCssCls, HTMLElementEvnts
{}
export function makeHTMLElementExt (element : Element) : HTMLElementExt
{
    Object.assign(element, CssClsHelperMixin);
    Object.assign(element, EventsHelperMixin);
    return element as HTMLElementExt; // @todo это может убить специфичные методы тэгов...
}

export type CompProps = Record< string, any >; // key?: CompKey, @todo как один из пропсов 
export type CompElement = HTMLElement | string;
export type CompKey = number | string;
export type CompParams = 
{
    asElement? : CompElement,    
    props? : CompProps,    
    cssCls? : CssCls,    
    events? : SingleOrPlural< EventLsnr >,
    settings? : Record< string, any >
}

export default abstract class DomComponent extends EventEmitter
{
    protected _id : string = ''; 
    protected _key : Nullable< CompKey > = null; 
    protected _element : HTMLElementExt; 
    protected _props : CompProps = {};
    protected _meta : Record< string, any > = {};
    protected _lifecircle : EventBus;
    protected _availEvents = [];

    protected _flags = {
        inSetPropsCall: false,
        nextEvntEmmited: false,
    };
    protected static _LIFE_EVENTS = {
        INIT: 'init',
        FLOW_CDM: 'flow:component-did-mount',
        FLOW_CDU: 'flow:component-did-update',
        FLOW_RENDER: 'flow:render'
    };
    constructor (params : CompParams = {}) 
    {
        super();

        const {asElement, props, events, cssCls = ''} = params; // @todo для children нужно обработать props  : propsAnComphildren

        this._id = makeUUID();
        this._key = props.key;
        

        // const {props, children} = this._separateChildrenFromProps(propsAnComphildren);



        this._meta = {asElement, props, cssCls, events}; // , events, cssCls, children

        this._props = this._makePropsProxy(props);

        this._lifecircle = new EventBus();
        this._regLifeEvents();

        this._lifecircle.emit(DomComponent._LIFE_EVENTS.INIT);
    }
    get element () // дальше задавать классы и навешивать события - через него 
    {
        return this._element;
    }
    get props ()
    {
        return this._props;
    }

    setProps (nextProps)
    {
        if (!nextProps) 
        {
            return;
        }
        this._flags.inSetPropsCall = true;
        this._flags.nextEvntEmmited = false;

        Object.assign(this._props, nextProps);
        this._flags.inSetPropsCall = false;
    }
    compile (template : Templator, props) 
    {
        const propsAndStubs = { ...props };

        Object.entries(this.children).forEach(([key, child]) => {
            propsAndStubs[key] = `<div data-id="${child._id}"></div>`
        });

        // return Templator.compile(template, propsAndStubs); 

        const fragment = this._createDocumentElement('template');

        fragment.innerHTML = Templator.compile(template, propsAndStubs);

        Object.values(this.children).forEach(child => {
            const stub = fragment.content.querySelector(`[data-id="${child.id}"]`);
            
            stub.replaceWith(child.getContent());
        });

        return fragment.content;       
    }
    dispatchComponentDidMount () 
    {
        this._lifecircle.emit(DomComponent._LIFE_EVENTS.FLOW_CDM);
    }  
    show () 
    {
        this.element.style.display = 'block';
    }
    hide () 
    {
        this.element.style.display = 'none';
    }
    
    init () 
    {
        this._createElement();
        this._processCssCls();
        this._processDomEvents();

        this._lifecircle.emit(DomComponent._LIFE_EVENTS.FLOW_RENDER);
    }  
    componentDidMount (oldProps) 
    {}
    componentDidUpdate (oldProps, newProps) 
    {
        return true; 
    }
    abstract render () : DocumentFragment;

    protected _regLifeEvents () 
    {
        this._lifecircle.on(DomComponent._LIFE_EVENTS.INIT, this.init.bind(this));
        this._lifecircle.on(DomComponent._LIFE_EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        this._lifecircle.on(DomComponent._LIFE_EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        this._lifecircle.on(DomComponent._LIFE_EVENTS.FLOW_RENDER, this._render.bind(this));
    }    
    protected _createElement () 
    {
        const {asElement} = this._meta; 

        const element = 'string' ==  typeof asElement ? document.createElement(asElement) : asElement.cloneNode(false);
        element.setAttribute('data-id', this._id);

        this._element = makeHTMLElementExt(element); // @todo придется переделывать из-за fragment ? 
    }
    protected _processCssCls ()
    {
        const {cssCls} = this._meta; 
        this.element.addCssCls(cssCls);
    }
    protected _processDomEvents ()
    {
        const {events} = this._meta;
        this.element.addEvntLsnrs(events);
    }

    // protected _processProps (props : CompProps)
    // {
    //     const processed = {};

    //     /*
    //     @todo здесь не нужно ничего process, нужнопросто найти все чилдрены, не удаляя их из пропсов 
    //     чтобы задиспачить о маунте этогохватит
    //     если нужно дать вовне доступ для настройки пропсов, то
    //     можно фильтровать дерево оставляя только компоненты (отдавать sub-? components)

    //     если мы передали компонет, то он уже с заданными пропсами. 
    //     потом если мы настраиваем пропсы, то по этому пути можем передавтать объект настроек.
    //     если передается другой компонент или примитив, то оно заменит собой компонент в шаблоне  

    //     если пропсы дочернего элемента не поменялись, то по идее его не нужно рендерить... хранить кеш рендеров? 

    //     менять events ? для childs? другие параметры для childs? 

    //     */

    //     Object.entries(props).forEach((value, name) => 
    //     {
    //         if (value instanceof DomComponent) 
    //         {
    //             // children[name] = value; @todo по идее просто созранять ссылку.. но тогда мы в рекурсии должны сохранить объект. можно через Map ? 
    //         } 
    //         else if (value instanceof Array)
    //         {
    //             processed[name] = []
    //             value.forEach((val, key) => 
    //             {
    //                 if (val instanceof DomComponent)
    //                 {
    //                     // @todo 
    //                 }
    //                 else if ('object' == typeof val)
    //                 {
    //                     val = this._processProps(val);
    //                 }                    
    //                 processed[name][key] = val;
    //             });
    //         }
    //         else if ('object' == typeof value)
    //         {
    //             processed[name] = this._processProps(value);
    //         }
    //         else
    //         {
    //             processed[name] = value;
    //         }
    //     });
    //     return processed;
    // }
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
    protected _makePropsProxy (props) 
    {
        return new Proxy(props, 
        {
            set: (target, prop, value) =>
            {
                if (!this._flags.inSetPropsCall)
                {
                    throw new Error('No access');
                }                
                const oldProps = {...target};
                target[prop] = value;

                if (!this._flags.nextEvntEmmited)
                {
                    this._lifecircle.emit(DomComponent._LIFE_EVENTS.FLOW_CDU, oldProps, target);
                    this._flags.nextEvntEmmited = true;
                }
                return true;
            },
            deleteProperty ()
            {
                throw new Error('No access');
            }
        });
    }

    _componentDidMount () 
    {
        this.componentDidMount(this.props);
    }
    _componentDidUpdate(oldProps, newProps) 
    {
        if (this.componentDidUpdate(oldProps, newProps))
        {
            this._lifecircle.emit(DomComponent._LIFE_EVENTS.FLOW_RENDER);
        }
    }
    _render() 
    {
        this.element.innerHTML = '';
        this.element.appendChild(this.render());
    }  
}

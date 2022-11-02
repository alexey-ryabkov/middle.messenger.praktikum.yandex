import { v4 as makeUUID } from 'uuid';
import EventEmitter from '@models/event_emitter';
import EventBus from '@models/event_bus';
import SimpleProps from '@models/simple_props';
import {Nullable, SingleOrPlural, EventLsnr, CompilableTemplate} from '@models/types';
import CssClsHelperMixin, {CssCls, HTMLElementCssCls} from '@lib-utils/css_cls_helper';
import EventsHelperMixin, {HTMLElementEvnts} from '@lib-utils/events_helper';

export interface HTMLElementExt extends HTMLElement, HTMLElementCssCls, HTMLElementEvnts
{}
export function makeHTMLElementExt (element : Element) : HTMLElementExt
{
    Object.assign(element, CssClsHelperMixin);
    Object.assign(element, EventsHelperMixin);
    return element as HTMLElementExt; 
}

export type CompKey = number | string;
export type CompElement = HTMLElement | DocumentFragment | string;
export type CompProps = {
    [key : string]: any,
    key?: CompKey
}; 
export type CompAttrs = Record< string, string | number | boolean >;
export type CompEvents = SingleOrPlural< EventLsnr >;
export type CompParams = 
{
    node? : CompElement,    
    props? : CompProps, 
    attrs? :  CompAttrs,  
    cssCls? : CssCls,    
    events? : CompEvents,
    settings? : Record< string, any >
}
export interface ComponentPropsEngine
{
    component : DomComponent;
    propsSubComponents : Record< string, DomComponent >;
    processProps () : void;
    compileWithProps (template : CompilableTemplate) : DocumentFragment;
}

export default abstract class DomComponent extends EventEmitter
{
    static readonly ID_ATTR = 'data-block_id';
    
    protected _id : string = ''; 
    protected _key : Nullable< CompKey > = null; 
    protected _element : HTMLElementExt; 
    protected _props : CompProps = {};
    protected _meta : Record< string, any > = {};
    protected _lifecircle : EventBus;
    protected _availEvents = [];
    protected _propsEngine : ComponentPropsEngine;

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
    constructor (params : CompParams) 
    {
        super();

        const {props} = params;
        this._processParams(params);

        let id = makeUUID();
        this._key = props.key; // TODO при reinit ? 

        this._props = this._makePropsProxy(props);
        // this._props = props;
        this._propsEngine = new SimpleProps(this);
        this._propsEngine.processProps();

        this._lifecircle = new EventBus();
        this._regLifeEvents();
        
        if (this._meta.node instanceof HTMLElement)
        {
            const nodeId = this._meta.node.getAttribute(DomComponent.ID_ATTR); // @todo а этим процессор занимается... получается логику раздвоили 
            if (nodeId)
            {
                id = nodeId;
            }
            this._id = id;
        }
        else
        {  
            this._id = id;
            this._lifecircle.emit(DomComponent._LIFE_EVENTS.INIT); // for node of HTMLElement it`s need to init component manually by mount method, otherwise go to init 
        }
    }
    get id ()  
    {
        return this._id;
    }    
    get content () // semantic alias
    {
        return this.element;
    }
    protected get element ()
    {
        return this._element;
    }
    
    get props ()
    {
        return this._props;
    }
    mount () // for node of HTMLElement it`s need to init component manually by this method
    {
        const {node} = this._meta; 

        if (node instanceof HTMLElement)
        {
            this._lifecircle.emit(DomComponent._LIFE_EVENTS.INIT);
        }
        return this;
    }
    setProps (nextProps : CompProps)
    {
        if (!this.element || !nextProps) 
        {
            return;
        }
        this._flags.inSetPropsCall = true;
        this._flags.nextEvntEmmited = false;

        Object.assign(this._props, nextProps);
        this._flags.inSetPropsCall = false;
    }
    setAttrs (attrs : CompAttrs)
    {
        Object.entries(attrs).forEach(([name, value]) => 
        {
            this.element.setAttribute(name, String(value));
        });
    }    
    dispatchComponentDidMount = () => this._lifecircle.emit(DomComponent._LIFE_EVENTS.FLOW_CDM);

    compile = (template : CompilableTemplate) => this._propsEngine.compileWithProps(template);   

    show = () => this.element.style.display = 'block';
    hide = () => this.element.style.display = 'none';
    
    init () 
    {
        this._initElement();
        this._processAttrs();
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
    abstract render () : DocumentFragment | HTMLElement;

    protected _processParams (params : CompParams)
    {
        this._meta = this._params4meta(params); 
    }
    protected _params4meta (params : CompParams)
    {
        const {node = 'div', attrs = {}, cssCls = '', events = []} = params; 
        return {node, attrs, cssCls, events};
    }
    protected _makePropsProxy (props) 
    {
        return new Proxy(props, 
        {
            set: (target, prop, value) =>
            {
                // console.log(prop, value);
                if (!this._flags.inSetPropsCall)
                {
                    throw new Error('No access');
                }
                // console.log('!!');
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
    protected _regLifeEvents () 
    {
        this._lifecircle.on(DomComponent._LIFE_EVENTS.INIT, this.init.bind(this));
        this._lifecircle.on(DomComponent._LIFE_EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        this._lifecircle.on(DomComponent._LIFE_EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        this._lifecircle.on(DomComponent._LIFE_EVENTS.FLOW_RENDER, this._render.bind(this));
    }    
    protected _initElement () 
    {
        const {node} = this._meta; 

        const element = typeof node == 'string' ? document.createElement(node) : node; 
        element.setAttribute(DomComponent.ID_ATTR, this._id);
    }
    protected _processAttrs ()
    {
        const {attrs} = this._meta; 

        this.setAttrs(attrs);
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
    protected _processProps = () => this._propsEngine.processProps();

    protected _componentDidMount () 
    {
        this.componentDidMount(this._props);
    }
    protected _componentDidUpdate(oldProps, newProps) 
    {
        if (this.componentDidUpdate(oldProps, newProps))
        {
            this._lifecircle.emit(DomComponent._LIFE_EVENTS.FLOW_RENDER);
        }
    }
    protected _render() 
    {
        this.element.innerHTML = '';
        this.element.appendChild(this.render());
    }  
    [Symbol.toPrimitive] (hint : string)
    {
        let result : string | number;
        switch (hint)
        {
            case 'number':
                result = NaN;
            break;

            default:
            case 'string':
                result = this.element.outerHTML;
            break;
        }
        return result;
    }
}

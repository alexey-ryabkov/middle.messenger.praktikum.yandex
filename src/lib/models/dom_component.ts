import { v4 as makeUUID } from 'uuid';
import EventEmitter from './event_emitter';
import EventBus from './event_bus';
import SimpleProps from './simple_props';
import {Nullable, SingleOrPlural, EventLsnr, CompilableTemplate} from './types';
import CssClsHelperMixin, {CssCls, HTMLElementCssCls} from '../utils/css_cls_helper';
import EventsHelperMixin, {HTMLElementEvnts} from '../utils/events_helper';

export interface HTMLElementExt extends HTMLElement, HTMLElementCssCls, HTMLElementEvnts
{}
export function makeHTMLElementExt (element : Element) : HTMLElementExt
{
    Object.assign(element, CssClsHelperMixin);
    Object.assign(element, EventsHelperMixin);
    return element as HTMLElementExt; 
}

export type CompProps = Record< string, any >; // key?: CompKey, @todo как один из пропсов 
export type CompElement = HTMLElement | DocumentFragment | string;
export type CompKey = number | string;
export type CompParams = 
{
    node? : CompElement,    
    props? : CompProps,    
    cssCls? : CssCls,    
    events? : SingleOrPlural< EventLsnr >,
    settings? : Record< string, any >
}

export interface ComponentPropsEngine
{
    component : DomComponent;
    propsSubComponents : DomComponent[];
    processProps () : void;
    compileWithProps (template : CompilableTemplate) : DocumentFragment;
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
    constructor (params : CompParams = {}) 
    {
        super();

        const {node, props, events, cssCls = ''} = params; 

        this._id = makeUUID();
        this._key = props.key; // @todo при reinit ? 
        this._meta = {node, props, cssCls, events}; // @todo реинициация с начальными prop ?

        this._props = this._makePropsProxy(props);
        this._propsEngine = new SimpleProps(this);
        this._propsEngine.processProps();

        this._lifecircle = new EventBus();
        this._regLifeEvents();

        this._lifecircle.emit(DomComponent._LIFE_EVENTS.INIT);
    }
    get id ()  
    {
        return this._id;
    }
    get element ()
    {
        return this._element;
    }
    get props ()
    {
        return this._props;
    }
    set props (nextProps)
    {
        if (!nextProps) 
        {
            return;
        }
        this._flags.inSetPropsCall = true;
        this._flags.nextEvntEmmited = false;

        Object.assign(this.props, nextProps);
        this._flags.inSetPropsCall = false;
    }
    dispatchComponentDidMount = () => this._lifecircle.emit(DomComponent._LIFE_EVENTS.FLOW_CDM);

    compile = (template : CompilableTemplate) => this._propsEngine.compileWithProps(template);    

    show = () => this.element.style.display = 'block';
    hide = () => this.element.style.display = 'none';
    
    init () 
    {
        this._initElement();
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

        const element = 'string' ==  typeof node ? document.createElement(node) : node; // .cloneNode(false)
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
    protected _processProps = () => this._propsEngine.processProps();

    protected _componentDidMount () 
    {
        this.componentDidMount(this.props);
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
}

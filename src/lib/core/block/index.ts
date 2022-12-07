import {v4 as makeUUID} from 'uuid';
import EventEmitter from '@core/block/event_emitter';
import EventBus from '@core/event_bus';
import DefaultBlockProps from '@core/block/def_props';
import {Nullable, SingleOrPlural, EventLsnr, CompilableTemplate, PlainObject} from '@core/types';
import CssClsHelperMixin, {CssCls, HTMLElementCssCls} from '@lib-utils/css_cls_helper';
import EventsHelperMixin, {HTMLElementEvnts} from '@lib-utils/events_helper';
import {isEqual} from '@lib-utils-kit';


export interface HTMLElementExt extends HTMLElement, HTMLElementCssCls, HTMLElementEvnts
{}
export function makeHTMLElementExt (element : Element) : HTMLElementExt
{
    Object.assign(element, CssClsHelperMixin);
    Object.assign(element, EventsHelperMixin);
    return element as HTMLElementExt; 
}

export type BlockID = number | string;
export type BlockKey = number | string;
export type BlockElement = HTMLElement | SVGElement | DocumentFragment | string;
export type BlockProps = {
    [key : string]: any,
    key?: BlockKey
}; 
export type BlockAttrs = Record< string, string | number | boolean >;
export type BlockEvents = SingleOrPlural< EventLsnr >;
export type BlockParams = 
{
    id? : BlockID, 
    node? : BlockElement,    
    props? : BlockProps, 
    attrs? :  BlockAttrs,  
    cssCls? : CssCls,    
    events? : BlockEvents,
    settings? : PlainObject
}
export interface BlockPropsEngine
{
    childBlocks : Iterable< Block >;
    processProps () : void;
    compileWithProps (template : CompilableTemplate) : DocumentFragment;
}

export default abstract class Block extends EventEmitter
{
    static readonly ID_ATTR = 'data-block_id';
    
    protected _id : BlockID; 
    protected _key : Nullable< BlockKey > = null; 
    protected _element : HTMLElementExt; 
    protected _props : BlockProps = {};
    protected _meta : Record< string, any > = {};
    protected _lifecircle : EventBus;
    protected _propsEngine : BlockPropsEngine;

    protected _flags = {
        inSetPropsCall: false,
        isPropsGotSet: false,
    };
    protected static _LIFE_EVENTS = {
        INIT: 'init',
        FLOW_CDM: 'flow:component-did-mount',
        FLOW_CDU: 'flow:component-did-update',
        FLOW_RENDER: 'flow:render'
    };
    constructor (params : BlockParams) 
    {
        super();

        const {props = {}} = params;
        this._processParams(params);

        let id = makeUUID();
        this._key = props?.key || null; 

        this._props = this._makePropsProxy(props);        
        this._processPropsEngine();
        this._processProps();   

        this._lifecircle = new EventBus();
        this._regLifeEvents();
        
        if (this._meta.node instanceof HTMLElement)
        {
            const nodeId = this._meta.node.getAttribute(Block.ID_ATTR); 
            if (nodeId)
            {
                id = nodeId;
            }
            this._id = id;
        }
        else
        {  
            this._id = id;
            // for node of HTMLElement it`s need to init component manually by mount method, otherwise go to init 
            this._lifecircle.emit(Block._LIFE_EVENTS.INIT); 
        }
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
    mount () // for node of HTMLElement it`s need to init component manually by this method
    {
        const {node} = this._meta; 

        if (node instanceof HTMLElement)
        {
            this._lifecircle.emit(Block._LIFE_EVENTS.INIT);
        }
        return this;
    }
    setProps (nextProps : any)
    {
        if (!this.element || !nextProps) 
        {
            return;
        }
        this._flags.inSetPropsCall = true;
        this._flags.isPropsGotSet = false;

        const oldProps = {...this._props};

        Object.assign(this._props, nextProps);
        
        this._processProps();

        if (this._flags.isPropsGotSet) 
        {
            this._lifecircle.emit(Block._LIFE_EVENTS.FLOW_CDU, oldProps, this._props);
        }

        this._flags.inSetPropsCall = false;
    }
    setAttrs (attrs : BlockAttrs)
    {
        // TODO process boolean attr, disabled for example
        Object.entries(attrs).forEach(([name, value]) => 
        {
            this.element.setAttribute(name, String(value));
        });
    }    
    dispatchComponentDidMount = () => this._lifecircle.emit(Block._LIFE_EVENTS.FLOW_CDM);

    compile (template : CompilableTemplate) 
    {
        return this._propsEngine.compileWithProps(template);   
    }

    show = () => this.element.style.display = 'block';
    hide = () => this.element.style.display = 'none';
    
    init () 
    {
        
        this._initElement();

        this._processAttrs();
        this._processCssCls();
        this._processDomEvents();

        this._lifecircle.emit(Block._LIFE_EVENTS.FLOW_RENDER);
    }      
    componentDidMount () {
        return;
    }
    componentDidUpdate (oldProps : BlockProps, newProps : BlockProps) 
    {
        let didUpd = !isEqual(oldProps, newProps);

        if (!didUpd && newProps?.key && newProps.key !== this._key)
        {
            this._key = newProps.key;
            didUpd = true;
        }
        return didUpd; 
    }
    abstract render () : DocumentFragment | HTMLElement;

    protected get _availEvents () : string[]
    {
        return [];
    } 
    protected _processParams (params : BlockParams)
    {
        this._meta = this._params4meta(params); 
    }
    protected _processPropsEngine ()
    {
        this._propsEngine = new DefaultBlockProps(this); 
    }
    protected _params4meta (params : BlockParams)
    {
        const {node = 'div', attrs = {}, cssCls = '', events = []} = params; 
        return {node, attrs, cssCls, events};
    }
    protected _makePropsProxy (props : BlockProps) 
    {
        return new Proxy(props, 
        {
            set: (target, prop : string, value) =>
            {
                // if (!this._flags.inSetPropsCall)
                // {
                //     throw new Error('No access');
                // }
                // FIXME                
                target[prop] = value;

                this._flags.isPropsGotSet = true;
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
        this._lifecircle.on(Block._LIFE_EVENTS.INIT, this.init.bind(this));
        this._lifecircle.on(Block._LIFE_EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        this._lifecircle.on(Block._LIFE_EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        this._lifecircle.on(Block._LIFE_EVENTS.FLOW_RENDER, this._render.bind(this));
    }    
    protected _initElement () 
    {
        const {node} = this._meta; 

        const element = typeof node == 'string' ? document.createElement(node) : node; 
        element.setAttribute(Block.ID_ATTR, this._id);

        this._element = makeHTMLElementExt(element);
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
        this.element.addEventExtListeners(events);
    }
    protected _processProps = () => this._propsEngine.processProps();

    protected _componentDidMount () 
    {
        this.componentDidMount();
    }
    protected _componentDidUpdate(oldProps : BlockProps, newProps : BlockProps) 
    {
        if (this.componentDidUpdate(oldProps, newProps))
        {
            this._lifecircle.emit(Block._LIFE_EVENTS.FLOW_RENDER);
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

import {CompilableTemplate} from '@models/types';
import Block, {BlockProps, BlockPropsEngine} from '@models/block';
// import structuredClone from '@ungap/structured-clone';

import { cloneDeep } from "lodash";

type PropsSubComponents = Map< Block, {parent : any, prop : string | number} >;

// function unproxify (val : any) : any {
//     if (val instanceof Array) return val.map(unproxify)
//     if (val instanceof Object) return Object.fromEntries(Object.entries(Object.assign({},val)).map(([k,v])=>[k,unproxify(v)]))
//     return val
// }

export default class DefaultBlockProps implements BlockPropsEngine
{
    protected _propsSubComponents : PropsSubComponents;
    protected _propsAndStubs : Record< string, any >;
    
    constructor () // protected _component : Block
    {
        this._propsAndStubs = {};
        this._propsSubComponents = new Map();
    }
    // get component () 
    // {
    //     return this._component;
    // }
    get subComponents () 
    {
        return this._propsSubComponents.keys();
    }
    // protected get _props () // every call gets component's props copy
    // {
    //     // return structuredClone({...this._component.props});
    //     return JSON.parse(JSON.stringify({...this._component.props}))
    //     // return {...this._component.props};
    //     // Object.assign({}, this._component.props); 
    // }
    processProps (props : BlockProps) 
    {
        // this._propsAndStubs = JSON.parse(JSON.stringify({...props}));
        //this._propsAndStubs = structuredClone({...props});
        this._propsAndStubs = cloneDeep(props);
        // this._propsAndStubs = {...props};

        this._propsSubComponents = new Map();
        DefaultBlockProps._processProps(this._propsAndStubs, this._propsSubComponents);
    }
    compileWithProps (template : CompilableTemplate, props : BlockProps) : DocumentFragment
    {   
        const isCL = false;//'chats' in this._propsAndStubs;
        const isCMC = 'avatar' in this._propsAndStubs && 'datetime' in this._propsAndStubs;

        // if (isww) console.log(this._propsSubComponents, JSON.stringify(this._propsSubComponents));
        
        // console.log(this._propsAndStubs);
        
        this._propsSubComponents.forEach( (inProps, subComponent) => 
        {
            // cause inProps is ref, it will replace in this._propsAndStubs 
            inProps.parent[inProps.prop] = `<div ${Block.ID_ATTR}="${subComponent.id}"></div>`;
        });

        

        // console.log(this._propsSubComponents);
        // console.log(this._propsAndStubs);

        const fragment = document.createElement('template');
        fragment.innerHTML = template.compile(this._propsAndStubs); 

        for (const subComponent of this._propsSubComponents.keys()) 
        {
            const stub = fragment.content.querySelector(`[${Block.ID_ATTR}="${subComponent.id}"]`);
            
            if (stub)
            {
                stub.replaceWith(subComponent.element);
                stub;
            }  
        }
        const cntnt = fragment.content; 

        return fragment.content; 
    }
    protected static _processProps (props : any, propsSubComponents : PropsSubComponents) 
    {
        Object.entries(props).forEach(([prop, value]) => 
        {
            if (value instanceof Block) 
            {
                propsSubComponents.set(value, {parent: props, prop});
            }
            else if (Array.isArray(value)) 
            {
                value.forEach(valueItem => 
                {
                    if (valueItem instanceof Object)
                    {
                        DefaultBlockProps._processProps(valueItem, propsSubComponents);
                    }
                    if (valueItem instanceof Block) 
                    {
                        propsSubComponents.set(valueItem, {parent: value, prop});
                    }
                });
            }
            else if (value instanceof Object) 
            {
                DefaultBlockProps._processProps(value, propsSubComponents);
            }
        });
    }
}

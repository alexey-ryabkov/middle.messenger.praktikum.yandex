import {CompilableTemplate} from '@models/types';
import Block, {BlockPropsEngine} from '@models/block';

type PropsSubComponents = Map< Block, {parent : any, prop : string | number} >;

export default class DefaultBlockProps implements BlockPropsEngine
{
    protected _propsSubComponents : PropsSubComponents;
    protected _propsAndStubs : Record< string, any >;
    
    constructor (protected _component : Block) 
    {
        this._propsAndStubs = {};
        this._propsSubComponents = new Map();
    }
    get component () 
    {
        return this._component;
    }
    get subComponents () 
    {
        return this._propsSubComponents.keys();
    }
    protected get _props () // every call gets component's props copy
    {
        return Object.assign({}, this._component.props); //{...this._component.props};
    }
    processProps () 
    {
        this._propsAndStubs = this._props;
        this._propsSubComponents = new Map();
        DefaultBlockProps._processProps(this._propsAndStubs, this._propsSubComponents);
    }
    compileWithProps (template : CompilableTemplate) : DocumentFragment
    {   
        this._propsSubComponents.forEach( (inProps, subComponent) => 
        {
            // cause inProps is ref, it will replace in this._propsAndStubs 
            inProps.parent[inProps.prop] = `<div ${Block.ID_ATTR}="${subComponent.id}"></div>`;
        });
        
        // console.log(this._propsSubComponents);
        // console.log(this._propsAndStubs);
        // debugger; 

        const fragment = document.createElement('template');
        fragment.innerHTML = template.compile(this._propsAndStubs); 

        for (let subComponent of this._propsSubComponents.keys()) 
        {
            const stub = fragment.content.querySelector(`[${Block.ID_ATTR}="${subComponent.id}"]`);
            
            if (stub)
            {
                stub.replaceWith(subComponent.element);
            }  
        }
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

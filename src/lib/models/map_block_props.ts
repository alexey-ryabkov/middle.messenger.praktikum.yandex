import {CompilableTemplate} from '@models/types';
import Block, {BlockPropsEngine} from '@models/block';

type PropsChildBlocks = Map< Block, {parent : any, prop : string | number} >;

export default class MapBlockProps implements BlockPropsEngine
{
    protected _propsChildBlocks : PropsChildBlocks;
    protected _propsAndStubs : Record< string, any >;
    
    constructor (protected _block : Block) 
    {
        this._propsAndStubs = {};
        this._propsChildBlocks = new Map();
    }
    get childBlocks () 
    {
        return this._propsChildBlocks.keys();
    }
    protected get _props () // every call gets block's props copy
    {
        return {...this._block.props};
    }
    processProps () 
    {
        this._propsAndStubs = this._props;
        this._propsChildBlocks = new Map();
        this._processProps(this._propsAndStubs, this._propsChildBlocks);
    }
    compileWithProps (template : CompilableTemplate) : DocumentFragment
    {   
        this._propsChildBlocks.forEach( (inProps, childBlock) => 
        {
            // cause inProps is ref, it will replace in this._propsAndStubs 
            inProps.parent[inProps.prop] = `<div ${Block.ID_ATTR}="${childBlock.id}"></div>`;
        });

        const fragment = document.createElement('template');
        fragment.innerHTML = template.compile(this._propsAndStubs); 

        for (const childBlock of this._propsChildBlocks.keys()) 
        {
            const stub = fragment.content.querySelector(`[${Block.ID_ATTR}="${childBlock.id}"]`);
            
            if (stub)
            {
                stub.replaceWith(childBlock.element);
            }  
        }
        return fragment.content; 
    }
    protected _processProps (props : any, propsChildBlocks : PropsChildBlocks) 
    {
        Object.entries(props).forEach(([prop, value]) => 
        {
            if (value instanceof Block) 
            {
                propsChildBlocks.set(value, {parent: props, prop});
            }
            else if (Array.isArray(value)) 
            {
                value.forEach(valueItem => 
                {
                    if (valueItem instanceof Object)
                    {
                        this._processProps(valueItem, propsChildBlocks);
                    }
                    if (valueItem instanceof Block) 
                    {
                        propsChildBlocks.set(valueItem, {parent: value, prop});
                    }
                });
            }
            else if (value instanceof Object) 
            {
                this._processProps(value, propsChildBlocks);
            }
        });
    }
}

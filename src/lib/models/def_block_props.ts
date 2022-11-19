import {CompilableTemplate} from '@models/types';
import Block, {BlockPropsEngine} from '@models/block';
import {cloneDeep} from '@lib-utils-kit';

export default class DefaultBlockProps implements BlockPropsEngine
{
    protected _propsChildBlocks : Record< string, Block >;
    protected _propsAndStubs : Record< string, any >;
    
    constructor (protected _block : Block) 
    {
        this._propsAndStubs = {};
        this._propsChildBlocks = {};
    }
    get childBlocks () 
    {
        return Object.values(this._propsChildBlocks);
    }
    protected get _props () 
    {
        return cloneDeep(this._block.props);
    }
    processProps () 
    {   
        this._propsChildBlocks = {};
        this._propsAndStubs = this._props;

        Object.entries(this._props).forEach(([ prop, value ]) => 
        {
            if (value instanceof Block) 
            {
                this._propsChildBlocks[prop] = value;
                this._propsAndStubs[prop] = DefaultBlockProps._makeStub(value);
            }
            else if (Array.isArray(value)) 
            {
                value.forEach((childVal, k) => 
                {
                    if (childVal instanceof Block) 
                    {
                        this._propsChildBlocks[`${prop}:${k}`] = childVal;
                        this._propsAndStubs[prop][k] = DefaultBlockProps._makeStub(childVal);
                    }
                })
            }
            else if (value instanceof Object) 
            {
                Object.entries(value).forEach(([ childProp, childPropVal ]) => 
                {
                    if (childPropVal instanceof Block) 
                    {
                        this._propsChildBlocks[`${prop}:${childProp}`] = childPropVal;
                        this._propsAndStubs[prop][childProp] = DefaultBlockProps._makeStub(childPropVal);
                    }
                });
            }
        });
    }
    compileWithProps (template : CompilableTemplate) : DocumentFragment
    {   
        const fragment = document.createElement('template');
        fragment.innerHTML = template.compile(this._propsAndStubs); 

        for (const childBlock of this.childBlocks) 
        {
            const stub = DefaultBlockProps._getStub(fragment.content, childBlock);
            
            if (stub)
            {
                stub.replaceWith(childBlock.element);
            }  
        }
        return fragment.content; 
    }
    protected static _makeStub = (block : Block) => `<div ${Block.ID_ATTR}="${block.id}"></div>`;

    protected static _getStub = (element: DocumentFragment | Element, block : Block) => element.querySelector(`[${Block.ID_ATTR}="${block.id}"]`);
}

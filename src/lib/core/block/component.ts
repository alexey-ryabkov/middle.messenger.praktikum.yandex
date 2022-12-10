import {CompilableTemplate} from '@core/types';
import {BlockEvents, BlockProps} from '@core/block';
import BemBlock, {BemCompParams, BemParams} from '@core/block/bem';

export type ComponentParams = Omit< BemCompParams, 'props' | 'events' | 'bem' >;

export default class ComponentBlock extends BemBlock 
{
    constructor (
        props? : BlockProps, 
        events : BlockEvents = [], 
        params : ComponentParams = {}) 
    {   
        // temporary stub for bem, that will be defined by _prepareBemParams method 
        super({props, events, bem: {name: 'block'}, ...params});
    }
    protected _processParams (params : BemCompParams)
    {
        super._processParams({ ...params, bem: this._prepareBemParams(params) });
    }    
    render ()
    {
        return this.compile(this._template); 
    }
    // can`t define method and class as an abstract cause of @core/flux/connect funcs    
    protected _prepareBemParams (params? : BemCompParams) : BemParams
    {
        throw new Error(`ComponentBlock _prepareBemCompParams method must be overridden in the subclass. Params ${params}`);
    }
    protected get _template () : CompilableTemplate
    {
        throw new Error('ComponentBlock _template getter should be overridden in the subclass');
    }    
}

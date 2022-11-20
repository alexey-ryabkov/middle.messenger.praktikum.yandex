import {CompilableTemplate} from '@core/types';
import BemBlock from '@core/block/bem';

export default abstract class ComponentBlock extends BemBlock 
{
    render ()
    {
        return this.compile(this._template); 
    }
    protected abstract get _template () : CompilableTemplate; 
}

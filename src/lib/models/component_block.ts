import {CompilableTemplate} from '@models/types';
import BemBlock from '@models/bem_block';

export default abstract class ComponentBlock extends BemBlock 
{
    render ()
    {
        return this.compile(this._template); 
    }
    protected abstract get _template () : CompilableTemplate; 
}

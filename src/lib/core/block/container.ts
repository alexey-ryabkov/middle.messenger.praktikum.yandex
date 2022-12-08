import {CompilableTemplate} from '@core/types';
import Block from '@core/block';

export default abstract class ContainerBlock extends Block
{
    render ()
    {
        return this.compile(this._template); 
    }
    protected abstract get _template () : CompilableTemplate; 
}

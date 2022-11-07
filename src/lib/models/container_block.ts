import {CompilableTemplate} from '@models/types';
import Block from './block';

export default abstract class ContainerBlock extends Block
{
    render ()
    {
        return this.compile(this._template); 
    }
    protected abstract get _template () : CompilableTemplate; 
}

import {CompilableTemplate} from '@models/types';
import BemBlock from '@models/bem_block';

// @todo абстрактный класс SimpleBlock не очень семантично 
// переименовать Block -> BemBlock -> ComponentBlock 
export default abstract class SimpleBlock extends BemBlock 
{
    render ()
    {
        return this.compile(this._template); 
    }
    protected abstract get _template () : CompilableTemplate; 
}

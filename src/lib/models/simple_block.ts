import {CompilableTemplate} from './types';
import BemBlock from './bem_block';

// @todo абстрактный класс SimpleBlock не очень семантично 
export default abstract class SimpleBlock extends BemBlock
{
    abstract _template : CompilableTemplate; 
    render = () => this.compile(this._template); 
}

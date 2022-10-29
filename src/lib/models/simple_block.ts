import {Compilable} from './types';
import BemBlock from './bem_block';

export default abstract class SimpleBlock extends BemBlock
{
    abstract _template : Compilable; 
    render = () => this._template.compile(this._props); // @todo нужно использовать compile для DomComponent 
}

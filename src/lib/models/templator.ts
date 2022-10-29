import Handlebars from 'handlebars';
import {Compilable} from './types';

export default class Templator implements Compilable 
{
    tpl : string = '';

    constructor (tpl : string) 
    {
        this.tpl = tpl;
    }
    compile (data : any) : string
    {
        return Templator.compile(this.tpl, data);
    }
    regAsTemplatorBlock (name : string)
    {
        Templator.regBlock(name, this.tpl);
    }
    static compile = (tpl : string, data : any) : string => Handlebars.compile(tpl)(data);
    static regBlock = (name : string, tpl : string) => Handlebars.registerPartial(name, tpl);
}

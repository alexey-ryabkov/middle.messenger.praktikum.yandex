import Handlebars from 'handlebars';
import {CompilableTemplate} from './types';

Handlebars.registerHelper ('ifEquals', function (arg1 : any, arg2 : any, options) 
{
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

export default class Templator implements CompilableTemplate 
{
    tpl = '';

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

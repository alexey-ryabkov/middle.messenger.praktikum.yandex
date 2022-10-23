import Handlebars from 'handlebars';

export default class Templator 
{
    _tpl = '';

    constructor (tpl) 
    {
        this._tpl = tpl;
    }
    get tpl ()
    {
        return this._tpl;
    }
    compile (data)
    {
        return Handlebars.compile(this._tpl)(data);
    }
    regAsTemplatorBlock(name)
    {
        Templator.regBlock(name, this._tpl);
    }
    static regBlock = (name, tpl) => Handlebars.registerPartial(name, tpl);
}

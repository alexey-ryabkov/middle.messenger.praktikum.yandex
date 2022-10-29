import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import tpl from './tpl.hbs';

export default class Messages extends ComponentBlock
{
    constructor ()
    {
        super({bem:{name:'_messages'}});
    }

    protected get _template () 
    {
        return new Templator(tpl);
    }
}

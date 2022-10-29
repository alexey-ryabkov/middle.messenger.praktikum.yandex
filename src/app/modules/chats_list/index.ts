import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import tpl from './tpl.hbs';

export default class ChatsList extends ComponentBlock
{
    constructor ()
    {
        super({bem:{name:'_chatsList'}});
    }

    protected get _template () 
    {
        return new Templator(tpl);
    }
}

import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import tpl from './tpl.hbs';

export default class UserProfile extends ComponentBlock
{
    constructor ()
    {
        super({bem:{name:'_userProfile'}});
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}

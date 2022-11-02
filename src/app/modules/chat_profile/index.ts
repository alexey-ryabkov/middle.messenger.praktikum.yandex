import Templator from '@models/templator';
import SimpleBlock from '@models/simple_block';
import tpl from './tpl.hbs';

export default class UserProfile extends SimpleBlock
{
    _template = new Templator(tpl);
    constructor ()
    {
        super({bem:{name:'name'}});
    }
}

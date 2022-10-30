import Templator from '../../../lib/models/templator';
import SimpleBlock from '../../../lib/models/simple_block';
import tpl from './tpl.hbs';

export default class UserProfile extends SimpleBlock
{
    _template = new Templator(tpl);
}

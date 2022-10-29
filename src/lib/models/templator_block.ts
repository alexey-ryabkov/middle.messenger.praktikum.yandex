import Templator from './templator';
import Container from './container';

export default abstract class TemplatorBlock extends Container // @todo пока это проблемный для понимания класс. по сути его не нужно инициализировать а достаточно только regAsTemplatorBlock в самом компоненте сделать 
{
    constructor (name : string, template : Templator, params = {})
    {
        super(template, params);
        template.regAsTemplatorBlock(name);
    }
}

import Templator from '@models/templator';
import SimpleBlock from '@models/simple_block';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

export default class MainContainer extends SimpleBlock 
{
    constructor (pageHolder : HTMLElement | string) 
    {   
        super({
            node: document.body, 
            props: {                
                page: pageHolder,
            },
            bem: {
                name: '_surApp',
                mods: {
                    elems: {
                        background: [['bg', 'image']] 
                    }
                }
            }
        });
    }
    get workarea ()
    {
        return this.elems['workarea'];
    }
    protected get _template () 
    {
        return template;
    }
}

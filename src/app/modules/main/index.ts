import Templator from '@models/templator';
import SimpleBlock from '@models/simple_block';
import tpl from './tpl.hbs';
import './style.scss';
import { CompilableTemplate } from '@models/types';

const template = new Templator(tpl);

export default class MainContainer extends SimpleBlock 
{
    constructor (pageHolder : HTMLElement | string) 
    {   
        console.log(new Templator(tpl));

        super({
            props: {
                node: document.body, 
                page: pageHolder,
            },
            bem: {
                name: '_appSur',
                mods: {
                    elems: {
                        workarea: [['bg', 'image']] 
                    }
                }
            }
        });
    }
    get workarea ()
    {
        return this.elems['workarea'];
    }
    protected get _template () : CompilableTemplate
    {
        return template;
    }
}

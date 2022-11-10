import {AppContainer} from '@models/types';
import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import tpl from './tpl.hbs';
import './style.scss';

export default class MainContainer extends ComponentBlock implements AppContainer
{
    constructor (root : HTMLElement, pageHolder : HTMLElement | string) 
    {   
        super({
            node: root, 
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
        return new Templator(tpl);
    }
}

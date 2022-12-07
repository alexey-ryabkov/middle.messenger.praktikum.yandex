import {AppContainer} from '@core/types';
import Templator from '@core/templator';
import {BemParams} from '@core/block/bem';
import Block from '@core/block';
import ComponentBlock from '@core/block/component';
import tpl from './tpl.hbs';
import './style.scss';


export default class MainContainer extends ComponentBlock implements AppContainer
{
    constructor (root : HTMLElement, workareaHolder : Block | HTMLElement | string) 
    {   
        super({ workarea: workareaHolder }, [], { node: root });
    }
    protected _prepareBemParams ()
    {
        const bem : BemParams = {
            name: '_surApp',
            mods: {
                elems: {
                    background: [['bg', 'image']] 
                }
            }
        };   
        return bem;
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

import {ContainarableApp} from '@core/types';
import Templator from '@core/templator';
import {BemParams} from '@core/block/bem';
import Layout from '@core/layout';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

export default class LeftcolWindowLayout extends Layout
{
    constructor (app : ContainarableApp)
    {
        super(app);
    } 
    protected _prepareBemParams ()
    {
        const bem : BemParams = {name: '_leftcolWindowLayout'};
        return bem;
    }
    protected get _template () 
    {
        return template; 
    }
}

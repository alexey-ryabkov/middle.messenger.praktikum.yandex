import {App} from '@models/types';
import Templator from '@models/templator';
import Layout from '@models/layout';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

export default class LeftcolWindowLayout extends Layout
{
    constructor (app : App)
    {
        super(app, { bem: {name: '_leftcolWindowLayout'} });
    } 
    protected get _template () 
    {
        return template; 
    }
}

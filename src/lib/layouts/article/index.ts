import {ContainarableApp} from '@core/types';
import Templator from '@core/templator';
import {BemParams} from '@core/block/bem';
import Layout, {LayoutProps} from '@core/layout';
import Caption, {CaptionSize} from '@lib-components/caption';
import { BlockEvents } from '@core/block';
import tpl from './tpl.hbs';
import './style.scss';

export type ArticleLayoutProps = LayoutProps & 
{
    title : string
};
export default class ArticleLayout extends Layout
{
    constructor (app : ContainarableApp, props : ArticleLayoutProps, events? : BlockEvents)
    {
        const caption = new Caption({ caption: props.title, size: CaptionSize.h1 });

        caption.bemMix(['_articleLayout', 'caption']);
        props.caption = caption;

        super(app, props, events);
    }
    protected _prepareBemParams ()
    {
        const bem : BemParams = {name: '_articleLayout'};
        return bem;
    }
    protected get _template () 
    {
        return new Templator(tpl); 
    }
}

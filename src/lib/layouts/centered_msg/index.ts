import {ContainarableApp} from '@core/types';
import Templator from '@core/templator';
import {BemParams} from '@core/block/bem';
import Layout, {LayoutProps} from '@core/layout';
import Caption from '@lib-components/caption';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

export type CenteredMsgLayoutProps = LayoutProps & 
{
    title : string,
    url : string,
    desc? : string,
};
export default class CenteredMsgLayout extends Layout
{
    constructor (app : ContainarableApp, props : CenteredMsgLayoutProps)
    {
        const caption = new Caption({caption: props.title});

        caption.bemMix(['_centeredMsgLayout', 'caption']);

        props.caption = caption;

        super(app, props);
    } 
    protected _prepareBemParams ()
    {
        const bem : BemParams = {name: '_centeredMsgLayout'};
        return bem;
    }
    protected get _template () 
    {
        return template; 
    }
}

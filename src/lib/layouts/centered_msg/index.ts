import {App} from '@models/types';
import Templator from '@models/templator';
import Layout, {LayoutProps} from '@models/layout';
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
    constructor (app : App, props : CenteredMsgLayoutProps)
    {
        const caption = new Caption({caption: props.title});

        caption.bemMix(['_centeredMsgLayout', 'caption']);

        props.caption = caption;

        super(app, { props, bem: {name: '_centeredMsgLayout'} });
    } 
    protected get _template () 
    {
        return template; 
    }
}

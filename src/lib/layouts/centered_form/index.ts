import {App} from '@core/types';
import Templator from '@core/templator';
import Layout, {LayoutProps} from '@core/layout';
import Caption, {CaptionSize} from '@lib-components/caption';
import { BlockEvents } from '@core/block';
import tpl from './tpl.hbs';
import './style.scss';

export type CenteredFormLayoutProps = LayoutProps & 
{
    title : string
};
export default class CenteredFormLayout extends Layout
{
    constructor (app : App, props : CenteredFormLayoutProps, events? : BlockEvents)
    {
        const caption = new Caption({ caption: props.title, size: CaptionSize.h1 });

        caption.bemMix(['_centeredFormLayout', 'caption']);
        props.caption = caption;

        super(app, { 
            props, 
            events, 
            bem: {name: '_centeredFormLayout'} 
        });
    } 
    protected get _template () 
    {
        return new Templator(tpl); 
    }
}

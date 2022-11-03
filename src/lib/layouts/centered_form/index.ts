import Templator from '@models/templator';
import Layout, {LayoutProps} from '@models/layout';
import Caption, {CaptionSize} from '@lib-components/caption';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

export type CenteredFormLayoutProps = LayoutProps & 
{
    title : string
};
export default class CenteredFormLayout extends Layout
{
    constructor (app, props : CenteredFormLayoutProps)
    {
        const caption = new Caption({ caption: props.title, size: CaptionSize.h1 });

        caption.bemMix(['_centeredFormLayout', 'caption']);
        props.caption = caption;

        super(app, { props, bem: {name: '_centeredFormLayout'} });
    } 
    protected get _template () 
    {
        return template; 
    }
}

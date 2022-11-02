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
    constructor (props : CenteredMsgLayoutProps)
    {
        const caption = new Caption({caption: props.title});

        caption.setAttrs({'bem-element': 'caption'}); 
        // TODO если переделать шаблоны на это, то микс не понадобиться
        caption.mix(['_centeredMsgLayout', 'caption']);

        props.caption = caption;

        super({ props, bem: {name: '_centeredMsgLayout'} });
    } 
    protected get _template () 
    {
        return template; 
    }
}

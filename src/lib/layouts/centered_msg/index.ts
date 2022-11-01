import Templator from '@models/templator';
import Layout, {LayoutProps} from '@models/layout';
import Caption from '@lib-components/caption';
import tpl from './tpl.hbs';
import './style.scss';

export type CenteredMsgLayoutProps = LayoutProps & 
{
    title : string,
    url : string,
    desc? : string,
};
export default class CenteredMsgLayout extends Layout
{
    _template = new Templator(tpl);

    constructor (props : CenteredMsgLayoutProps)
    {
        const caption = new Caption({caption: props.title});

        caption.setAttrs({'bem-element': 'caption'}); // @todo если переделать шаблоны на это, то микс не понадобиться
        caption.mix(['_centeredMsgLayout', 'caption']);

        props.caption = caption;

        super({ props, bem: {name: '_centeredMsgLayout'} });
    } 
}

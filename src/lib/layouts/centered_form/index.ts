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



// <div class="icontainer icontainer--bg_glass icontainer--dropshadow icontainer--size_big _signFormLayout__content {{areas.containerCssClass}}">
//     <div class="icontainer__header">  
//     {{#with areas}}      
//     {{> caption tag="h1" caption=formTitle cssClass="_signFormLayout__caption" headlineCssClass="caption__headline--size_h1"}}
//     {{/with}}
//     </div>
//     <div class="icontainer__content">
//         <form action="" class="form _signFormLayout__form"> 
//         {{{areas.form}}}
//         </form>
//     </div>
// </div>  


// import Layout from '@models/layout';
// import '../../components/caption';
// import tpl from './tpl.hbs';
// import './style.scss';


// export default new Layout(tpl, '_centeredFormLayout');

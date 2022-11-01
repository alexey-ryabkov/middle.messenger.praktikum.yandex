import {BemCompParams} from '@models/bem_block';
import App from '@app';
import SimpleBlock from '@models/simple_block';
import {CompProps} from '@models/dom_component';

const app = App.instance;

export type LayoutProps = CompProps & {areas? : Record< string, SimpleBlock >};

export default abstract class Layout extends SimpleBlock
{
    constructor (params : BemCompParams)
    {
        if (!params.props)
        {
            params.props = {};
        }
        params.props.node = document.body;        
        super(params);
    }
    set areas (areas : Record< string, SimpleBlock >) // layout areas, for example {content: ..., sidebar: ...}
    {
        this.setProps({areas}); 
    }
    protected _render() // @todo если модель запрашивает App, то она не может быть в lib... либо app должен быть в моделях... а от него наследоваться SurApp 
    // мб передавать в конструкторе container? который выаолняет определенный интерфейс
    // подумать с т.з. переноссимости 
    {
        app.container.workarea.innerHTML = '';
        app.container.workarea.appendChild(this.render());
    }  
}

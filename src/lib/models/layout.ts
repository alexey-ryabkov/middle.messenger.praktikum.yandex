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
        params.node = document.body;        
        super(params);
    }
    set areas (areas : Record< string, SimpleBlock | string >) // layout areas, for example {content: ..., sidebar: ...}
    {
        this.setProps({areas}); 
    }
    protected _render() 
    // TODO если модель запрашивает App, то она не может быть в lib... либо app должен быть в моделях... а от него наследоваться SurApp 
    // мб передавать в конструкторе container? который выаолняет определенный интерфейс
    // подумать с т.з. переноссимости 
    {
        // console.log('in Layout _render', this._props);

        app.container.workarea.innerHTML = '';
        app.container.workarea.appendChild(this.render());

        this._processElems();
        this._processElemCssCls();
        this._processElemsDomEvents();
    }  
}

import {App, AppContainer} from '@models/types';
import {BlockProps, BlockEvents} from '@models/block';
import {BemCompParams} from '@models/bem_block';
import ComponentBlock from '@models/component_block';
import Block from '@models/block';
import {plural2Arr} from '@lib-utils-kit';

export type LayoutProps = BlockProps & {areas? : Record< string, Block >};

export default abstract class Layout extends ComponentBlock
{
    protected _container : AppContainer;
    protected _events : BlockEvents;
    
    constructor (app : App, params : BemCompParams)
    {
        params.node = app.root; 
        super(params);

        this._container = app.container;

        if (params.events)
        {
            this._events = params.events;
        }
    }
    set areas (areas : Record< string, Block | string >) // layout areas, for example {content: ..., sidebar: ...}
    {
        this.setProps({areas}); 
    }
    unmount ()
    {
        if (this._events)
        {
            plural2Arr(this._events).forEach(lsnr => 
            {
                this.element.removeEvntLsnrs(lsnr);
            })
        } 
        this._container.workarea.innerHTML = '';
        this._container.bemClear([this.bemName]);
    }
    protected _render() 
    {
        this._container.workarea.innerHTML = '';
        this._container.workarea.appendChild(this.render());

        this.processElems();
        this._processElemCssCls();
        this._processElemsDomEvents();
    }  
}
